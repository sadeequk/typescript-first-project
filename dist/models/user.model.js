"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const index_1 = require("../utils/index");
const schema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: null
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    picture: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    role: {
        type: String,
        required: true,
        enum: ['super', 'admin', 'user']
    },
    verified: {
        type: Boolean,
        required: false,
        default: true,
    },
    suspended: {
        type: Boolean,
        required: false,
        default: false
    },
    tokens: [
        {
            _id: false,
            type: {
                type: String,
                required: true,
                enum: ['login', 'verification', 'reset']
            },
            token: {
                type: String,
                required: true
            },
            metadata: {
                type: Map,
                of: String,
                required: false,
                default: {}
            },
            expireAt: {
                type: Date,
                required: true
            },
            createdAt: {
                type: Date,
                required: true
            }
        }
    ],
}, {
    timestamps: true
});
schema.pre('save', async function (next) {
    if (!this._id) {
        this._id = await (0, index_1.nanoId)(8);
    }
    next();
});
const User = (0, mongoose_1.model)('User', schema);
exports.default = User;
