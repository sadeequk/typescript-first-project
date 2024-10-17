"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const process_1 = require("process");
const index_1 = require("../utils/index");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const routes = (0, express_1.Router)();
routes.get('/', (req, res) => {
    const serverUpTime = Number((0, process_1.uptime)() / 60);
    return (0, index_1.sendResponse)(res, 200, {
        time: new Date().toISOString(),
        uptime: serverUpTime > 60
            ? (serverUpTime / 60).toFixed(2) + ' hours'
            : serverUpTime.toFixed(2) + ' Mins',
        platform: process_1.platform,
        arch: process_1.arch,
        node: process_1.version,
    });
});
routes.use('/auth', auth_routes_1.default);
exports.default = routes;
