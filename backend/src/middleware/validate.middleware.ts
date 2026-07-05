import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate =
  (schema: Joi.ObjectSchema, source: 'body' | 'query' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
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
