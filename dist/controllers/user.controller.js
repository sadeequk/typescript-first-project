"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthToken = exports.login = exports.createUser = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const index_1 = require("../utils/index");
const createUser = async (user) => {
    try {
        if (await user_model_1.default.findOne({ email: user.email }).lean()) {
            throw new Error('400', { cause: `${user.email} is already registered!` });
        }
        const doc = new user_model_1.default({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: await (0, index_1.generateHash)(user.password),
            role: user.role,
            phone: user.phone ?? null,
            picture: null,
            // verified: user.verified ?? false,
            suspended: user.suspended ?? false
        });
        if (!doc.verified) {
            doc.tokens.push({
                type: 'verification',
                token: await (0, index_1.nanoId)(16),
                expireAt: (0, dayjs_1.default)().add(15, 'minutes').toDate(),
                createdAt: (0, dayjs_1.default)().toDate()
            });
        }
        const jwt = (0, index_1.generateToken)(doc._id, { email: doc.email, role: doc.role });
        doc.tokens.push({
            type: 'login',
            token: jwt.token,
            expireAt: (0, dayjs_1.default)().add(jwt.expiry.amount, jwt.expiry.unit).toDate(),
            createdAt: (0, dayjs_1.default)().toDate()
        });
        await doc.save();
        return { id: doc._id, ...doc.toObject(), token: jwt.token };
    }
    catch (error) {
        if (error instanceof Error)
            throw (0, index_1.parseError)(error);
        else
            throw error;
    }
};
exports.createUser = createUser;
const login = async (credentials) => {
    try {
        const user = await user_model_1.default.findOne({ email: credentials.email }).lean();
        if (!user)
            throw new Error('400', { cause: 'Invalid email or password!' });
        if (!(await (0, index_1.verifyHash)(credentials.password, user.password))) {
            throw new Error('400', { cause: 'Invalid email or password!' });
        }
        if (!user.verified) {
            throw new Error('405', { cause: 'Please verify your email to continue!' });
        }
        if (user.suspended) {
            throw new Error('405', { cause: 'Your account is suspended!' });
        }
        const jwt = await (0, exports.getAuthToken)(user._id);
        return { id: user._id, ...user, token: jwt.token };
    }
    catch (error) {
        if (error instanceof Error)
            throw (0, index_1.parseError)(error);
        else
            throw error;
    }
};
exports.login = login;
const getAuthToken = async (id) => {
    try {
        const user = await user_model_1.default.findById(id);
        if (!user)
            throw new Error('401', { cause: 'User not found! Please login again' });
        const today = (0, dayjs_1.default)();
        const validTokens = user.tokens.filter((token) => token.expireAt > today.toDate());
        const loginTokens = validTokens
            .filter((token) => token.type === 'login')
            .sort((a, b) => b.expireAt.getTime() - a.expireAt.getTime());
        user.tokens = validTokens;
        await user.save();
        if (loginTokens[0])
            return { token: loginTokens[0].token };
        else {
            const jwt = (0, index_1.generateToken)(user._id, { email: user.email, role: user.role });
            user.tokens.push({
                type: 'login',
                token: jwt.token,
                expireAt: (0, dayjs_1.default)().add(jwt.expiry.amount, jwt.expiry.unit).toDate(),
                createdAt: (0, dayjs_1.default)().toDate()
            });
            await user.save();
            return { token: jwt.token };
        }
    }
    catch (error) {
        if (error instanceof Error)
            throw (0, index_1.parseError)(error);
        else
            throw error;
    }
};
exports.getAuthToken = getAuthToken;
