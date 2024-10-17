"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./configs/database"));
const index_1 = require("./utils/index");
dotenv_1.default.config();
const PORT = Number(process.env.PORT) || 8080;
database_1.default.connect().then(() => {
    app_1.default.listen(PORT, () => {
        (0, index_1.log)('server', `Server is listening on port ${PORT}.`);
    });
});
