"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, source = 'body') => (req, res, next) => {
    const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
    if (error) {
        return res.status(400).json({
            message: 'Validation failed',
            details: error.details.map((d) => d.message),
        });
    }
    req[source] = value;
    next();
};
exports.validate = validate;
