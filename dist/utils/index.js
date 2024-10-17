"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.verifyHash = exports.generateHash = exports.sendErrorResponse = exports.parseError = exports.decodeToken = exports.nanoId = exports.sendResponse = exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const util_1 = __importDefault(require("util"));
// *============ Log ============*
const log = (scope, data) => {
    const debug = process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true'
        ? true
        : false;
    switch (scope) {
        case 'server':
            console.log(chalk_1.default.green(`[${scope}] ${typeof data === 'object'
                ? util_1.default.inspect(data, false, null, true)
                : data}`));
            break;
        case 'info':
            if (debug)
                console.log(chalk_1.default.white(`[${scope}] ${typeof data === 'object'
                    ? util_1.default.inspect(data, false, null, true)
                    : data}`));
            break;
        case 'warn':
            console.log(chalk_1.default.yellow(`[${scope}] ${typeof data === 'object'
                ? util_1.default.inspect(data, false, null, true)
                : data}`));
            break;
        case 'error':
            console.log(chalk_1.default.red(`[${scope}] ${typeof data === 'object'
                ? util_1.default.inspect(data, false, null, true)
                : data}`));
            break;
        default:
            if (debug)
                console.log(chalk_1.default.white(`[${scope}] ${typeof data === 'object'
                    ? util_1.default.inspect(data, false, null, true)
                    : data}`));
            break;
    }
};
exports.log = log;
// *============ Send Response ============*
const sendResponse = (res, status, data) => {
    return res.status(status).json({
        code: 'SUCCESS',
        data: data
    });
};
exports.sendResponse = sendResponse;
const nanoId = async (length = 10) => {
    const { customAlphabet } = await import('nanoid');
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return customAlphabet(alphabet)(length);
};
exports.nanoId = nanoId;
const decodeToken = (token) => {
    const key = process.env.PRIVATE_KEY;
    const domain = process.env.DOMAIN;
    const apiDomain = process.env.API_DOMAIN;
    if (!key)
        throw new Error('500', {
            cause: 'PRIVATE_KEY is not set in environment variables'
        });
    const payload = jsonwebtoken_1.default.verify(token, key);
    if (!payload || typeof payload === 'string') {
        return null;
    }
    const { sub, iss, aud, ...res } = payload;
    return {
        payload: { id: sub, ...res },
        checks: {
            iss: domain ? (iss && iss === domain ? true : false) : true,
            aud: apiDomain ? (aud && aud === apiDomain ? true : false) : true
        }
    };
};
exports.decodeToken = decodeToken;
const parseError = (error) => {
    const getErrorName = (code) => {
        switch (code) {
            case 400:
                return [400, 'BAD_REQUEST'];
            case 401:
                return [401, 'UNAUTHORIZED'];
            case 402:
                return [402, 'PAYMENT_REQUIRED'];
            case 403:
                return [403, 'FORBIDDEN'];
            case 404:
                return [404, 'NOT_FOUND'];
            case 405:
                return [405, 'NOT_ALLOWED'];
            case 406:
                return [406, 'NOT_ACCEPTABLE'];
            case 409:
                return [409, 'CONFLICT'];
            case 429:
                return [429, 'TOO_MANY_REQUESTS'];
            case 500:
                return [500, 'INTERNAL_SERVER_ERROR'];
            default:
                return [500, 'ERROR'];
        }
    };
    const regex = /\/([^\s:]+):(\d+):\d+/g;
    const stack = error.stack ? [...error.stack.matchAll(regex)][0] : undefined;
    return {
        name: getErrorName(Number(error.message))[1],
        code: getErrorName(Number(error.message))[0],
        message: error.cause ? String(error.cause) : error.message,
        fileName: stack ? `/${stack[1]}` : undefined,
        lineNumber: stack ? stack[2] : undefined
    };
};
exports.parseError = parseError;
const sendErrorResponse = (res, error) => {
    const debug = process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true'
        ? true
        : false;
    (0, exports.log)('error', error);
    const { name, code, ...data } = error;
    if (code !== 500)
        (0, exports.log)('warn', error);
    else
        (0, exports.log)('error', error);
    const payload = debug ? data : { message: data.message };
    return res.status(code).json({
        code: name,
        error: payload
    });
};
exports.sendErrorResponse = sendErrorResponse;
const generateHash = async (str) => {
    return await bcrypt_1.default.hash(str, await bcrypt_1.default.genSalt(10));
};
exports.generateHash = generateHash;
const verifyHash = async (str, hash) => {
    return await bcrypt_1.default.compare(str, hash);
};
exports.verifyHash = verifyHash;
const generateToken = (id, payload) => {
    const key = process.env.PRIVATE_KEY;
    const expiry = process.env.TOKEN_EXPIRY ?? '3d';
    const domain = process.env.DOMAIN;
    const apiDomain = process.env.API_DOMAIN;
    const regex = /^(\d+)([smhdw])$/;
    const checks = expiry.match(regex);
    if (!checks || !checks[1] || !checks[2])
        throw new Error('Invalid token expiry format found in environment variables! Use format like "5m", "1h", "3d".');
    if (!key)
        throw new Error('500', {
            cause: 'PRIVATE_KEY is not set in environment variables'
        });
    const expAmount = parseInt(checks[1], 10);
    const expUnit = checks[2];
    return {
        token: jsonwebtoken_1.default.sign({ sub: id, iss: domain, aud: apiDomain, ...payload }, key, {
            expiresIn: expiry
        }),
        expiry: {
            amount: expAmount,
            unit: expUnit
        }
    };
};
exports.generateToken = generateToken;
