"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { getUser } from '../controllers/user.controller'
const index_1 = require("../utils/index");
const getPayload = (token) => {
    try {
        if (!token || token.length === 0)
            throw new Error('401', { cause: 'No authentication token provided' });
        const data = (0, index_1.decodeToken)(token);
        if (!data)
            throw new Error('401', {
                cause: 'Invalid token provided! Please login again'
            });
        const { id, email, role } = data.payload;
        if (!id || !email || !role || !['super', 'admin', 'user'].includes(role))
            throw new Error('401', {
                cause: 'Invalid token provided! Please login again'
            });
        return { id, email, role };
    }
    catch (error) {
        if (error instanceof Error)
            throw (0, index_1.parseError)(error);
        else
            throw error;
    }
};
const auth = (roles) => async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader ? authHeader.split(' ')[1] : null;
        const { id, email, role } = getPayload(token);
        //   const user = await getUser({ id: id })
        //   if (!user.verified)
        //     throw new Error('405', {
        //       cause: 'Please verify your email to continue!'
        //     })
        //   if (user.suspended)
        //     throw new Error('405', {
        //       cause:
        //         'Your account is suspended! Please contact admin for more details'
        //     })
        //   if (!roles.includes(user.role))
        //     throw new Error('403', {
        //       cause: 'You are not allowed to perform this action!'
        //     })
        //   req.auth = { id, email, role }
        return next();
    }
    catch (error) {
        if (error instanceof Error)
            return (0, index_1.sendErrorResponse)(res, (0, index_1.parseError)(error));
        else
            return (0, index_1.sendErrorResponse)(res, error);
    }
};
exports.default = auth;
