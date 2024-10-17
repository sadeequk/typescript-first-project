"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../utils/index");
const validate = (schema, key = 'body') => (req, res, next) => {
    const { error } = schema.validate(req[key], {
        errors: { label: 'key', wrap: { label: false } }
    });
    if (error) {
        return (0, index_1.sendErrorResponse)(res, (0, index_1.parseError)(new Error('400', { cause: error.details[0]?.message })));
    }
    return next();
};
exports.default = validate;
