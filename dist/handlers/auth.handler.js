"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user.controller");
const utils_1 = require("../utils");
const registerHandler = async (req, res) => {
    try {
        console.log("Incoming request:", req.body);
        const { firstName, lastName, fullName, email, password, phone } = req.body;
        const user = await (0, user_controller_1.createUser)({
            firstName: firstName ? firstName : fullName.split(' ')[0],
            lastName: lastName ? lastName : fullName.split(' ')[1],
            email,
            password,
            phone,
            role: 'user'
        });
        return (0, utils_1.sendResponse)(res, 201, user);
    }
    catch (error) {
        if (error instanceof Error)
            return (0, utils_1.sendErrorResponse)(res, (0, utils_1.parseError)(error));
        else
            return (0, utils_1.sendErrorResponse)(res, error);
    }
};
const loginHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, user_controller_1.login)({ email, password });
        return (0, utils_1.sendResponse)(res, 200, user);
    }
    catch (error) {
        if (error instanceof Error)
            return (0, utils_1.sendErrorResponse)(res, (0, utils_1.parseError)(error));
        else
            return (0, utils_1.sendErrorResponse)(res, error);
    }
};
exports.default = { registerHandler, loginHandler };
