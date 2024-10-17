"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_handler_1 = __importDefault(require("../handlers/auth.handler"));
const auth_schemas_1 = __importDefault(require("../schemas/auth.schemas"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const authRoutes = (0, express_1.Router)();
authRoutes.post('/test', (req, res) => {
    console.log("Test route body:", req.body);
    res.status(200).json({ message: "Test route hit successfully", data: req.body });
});
authRoutes.post('/registor', auth_handler_1.default.registerHandler);
// authRoutes.post('/registor', validate(authSchema.registerSchema), authHandler.registerHandler);
authRoutes.post('/login', (0, validate_1.default)(auth_schemas_1.default.loginSchema), auth_handler_1.default.loginHandler);
exports.default = authRoutes;
