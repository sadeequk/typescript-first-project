"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../utils/index");
dotenv_1.default.config();
const connect = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri)
            throw new Error('MONGO_URI is not set in environment variables');
        (0, index_1.log)('info', 'Connecting to Database...');
        mongoose_1.default.set('strictQuery', false);
        const client = await mongoose_1.default.connect(uri);
        console.log(`Connected to (${client.connection.name}) Database`);
    }
    catch (error) {
        (0, index_1.log)('error', `Error connecting to Database!`);
        (0, index_1.log)('error', error);
        process.exit(1);
    }
};
exports.default = { connect };
