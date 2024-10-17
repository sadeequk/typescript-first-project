import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { parseError, sendErrorResponse } from '../utils/index'

const validate =
  (schema: Joi.ObjectSchema, key: 'body' | 'params' | 'query' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[key], {
      errors: { label: 'key', wrap: { label: false } }
    })
    if (error) {
      return sendErrorResponse(
        res,
        parseError(new Error('400', { cause: error.details[0]?.message }))
      )
    }
    return next()
  }

export default validate
