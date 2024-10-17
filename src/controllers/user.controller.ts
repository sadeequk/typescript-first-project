import type { FilterQuery } from 'mongoose';
import type { Models } from '../types';
import dayjs from 'dayjs';
import User from '../models/user.model';
import { nanoId, generateHash, verifyHash, generateToken, parseError } from '../utils/index';

export const createUser = async (user: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'super' | 'admin' | 'user';
  phone?: string;
  picture?: { fileName: string; buffer: Buffer; mimetype?: string };
  verified?: boolean;
  suspended?: boolean;
}) => {
  try {
    if (await User.findOne({ email: user.email }).lean()) {
      throw new Error('400', { cause: `${user.email} is already registered!` });
    }

    const doc = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: await generateHash(user.password),
      role: user.role,
      phone: user.phone ?? null,
      picture: null,
      verified: user.verified ?? false,
      suspended: user.suspended ?? false
    });

    if (!doc.verified) {
      doc.tokens.push({
        type: 'verification',
        token: await nanoId(16),
        expireAt: dayjs().add(15, 'minutes').toDate(),
        createdAt: dayjs().toDate()
      });
    }

    const jwt = generateToken(doc._id, { email: doc.email, role: doc.role });
    doc.tokens.push({
      type: 'login',
      token: jwt.token,
      expireAt: dayjs().add(jwt.expiry.amount, jwt.expiry.unit).toDate(),
      createdAt: dayjs().toDate()
    });
    await doc.save();

    return { id: doc._id, ...doc.toObject(), token: jwt.token };
  } catch (error) {
    if (error instanceof Error) throw parseError(error);
    else throw error;
  }
};

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const user = await User.findOne({ email: credentials.email }).lean();
    if (!user) throw new Error('400', { cause: 'Invalid email or password!' });

    if (!(await verifyHash(credentials.password, user.password))) {
      throw new Error('400', { cause: 'Invalid email or password!' });
    }

    if (!user.verified) {
      throw new Error('405', { cause: 'Please verify your email to continue!' });
    }
    if (user.suspended) {
      throw new Error('405', { cause: 'Your account is suspended!' });
    }

    const jwt = await getAuthToken(user._id);
    return { id: user._id, ...user, token: jwt.token };
  } catch (error) {
    if (error instanceof Error) throw parseError(error);
    else throw error;
  }
};

export const getAuthToken = async (id: string) => {
  try {
    const user = await User.findById(id);
    if (!user) throw new Error('401', { cause: 'User not found! Please login again' });

    const today = dayjs();
    const validTokens = user.tokens.filter((token) => token.expireAt > today.toDate());
    const loginTokens = validTokens
      .filter((token) => token.type === 'login')
      .sort((a, b) => b.expireAt.getTime() - a.expireAt.getTime());

    user.tokens = validTokens;
    await user.save();

    if (loginTokens[0]) return { token: loginTokens[0].token };
    else {
      const jwt = generateToken(user._id, { email: user.email, role: user.role });
      user.tokens.push({
        type: 'login',
        token: jwt.token,
        expireAt: dayjs().add(jwt.expiry.amount, jwt.expiry.unit).toDate(),
        createdAt: dayjs().toDate()
      });
      await user.save();
      return { token: jwt.token };
    }
  } catch (error) {
    if (error instanceof Error) throw parseError(error);
    else throw error;
  }
};
