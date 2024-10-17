import type { Response } from 'express'
import type { ControllerError } from '../types'

import chalk from 'chalk'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import env from 'dotenv'
env.config()
import util from 'util'





// *============ Log ============*
export const log = (scope: 'server' | 'info' | 'warn' | 'error', data: any) => {
  const debug =
    process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true'
      ? true
      : false
  switch (scope) {
    case 'server':
      console.log(
        chalk.green(
          `[${scope}] ${
            typeof data === 'object'
              ? util.inspect(data, false, null, true)
              : data
          }`
        )
      )
      break
    case 'info':
      if (debug)
        console.log(
          chalk.white(
            `[${scope}] ${
              typeof data === 'object'
                ? util.inspect(data, false, null, true)
                : data
            }`
          )
        )
      break
    case 'warn':
      console.log(
        chalk.yellow(
          `[${scope}] ${
            typeof data === 'object'
              ? util.inspect(data, false, null, true)
              : data
          }`
        )
      )
      break
    case 'error':
      console.log(
        chalk.red(
          `[${scope}] ${
            typeof data === 'object'
              ? util.inspect(data, false, null, true)
              : data
          }`
        )
      )
      break
    default:
      if (debug)
        console.log(
          chalk.white(
            `[${scope}] ${
              typeof data === 'object'
                ? util.inspect(data, false, null, true)
                : data
            }`
          )
        )
      break
  }
}
// *============ Send Response ============*
export const sendResponse = (res: Response, status: number, data: any) => {
  return res.status(status).json({
    code: 'SUCCESS',
    data: data
  })
}

export const nanoId = async (length: number = 10) => {
  const { customAlphabet } = await import('nanoid')
  const alphabet =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return customAlphabet(alphabet)(length)
}

export const decodeToken = (token: string) => {
  const key = process.env.PRIVATE_KEY
  const domain = process.env.DOMAIN
  const apiDomain = process.env.API_DOMAIN

  if (!key)
    throw new Error('500', {
      cause: 'PRIVATE_KEY is not set in environment variables'
    })

  const payload = jwt.verify(token, key)
  if (!payload || typeof payload === 'string') {
    return null
  }

  const { sub, iss, aud, ...res } = payload
  return {
    payload: { id: sub, ...res },
    checks: {
      iss: domain ? (iss && iss === domain ? true : false) : true,
      aud: apiDomain ? (aud && aud === apiDomain ? true : false) : true
    }
  }
}

export const parseError = (error: Error) => {
  const getErrorName = (code: number) => {
    switch (code) {
      case 400:
        return [400, 'BAD_REQUEST']
      case 401:
        return [401, 'UNAUTHORIZED']
      case 402:
        return [402, 'PAYMENT_REQUIRED']
      case 403:
        return [403, 'FORBIDDEN']
      case 404:
        return [404, 'NOT_FOUND']
      case 405:
        return [405, 'NOT_ALLOWED']
      case 406:
        return [406, 'NOT_ACCEPTABLE']
      case 409:
        return [409, 'CONFLICT']
      case 429:
        return [429, 'TOO_MANY_REQUESTS']
      case 500:
        return [500, 'INTERNAL_SERVER_ERROR']
      default:
        return [500, 'ERROR']
    }
  }
  const regex = /\/([^\s:]+):(\d+):\d+/g
  const stack = error.stack ? [...error.stack.matchAll(regex)][0] : undefined
  return {
    name: getErrorName(Number(error.message))[1] as string,
    code: getErrorName(Number(error.message))[0] as number,
    message: error.cause ? String(error.cause) : error.message,
    fileName: stack ? `/${stack[1]}` : undefined,
    lineNumber: stack ? stack[2] : undefined
  }
}

export const sendErrorResponse = (res: Response, error: ControllerError) => {
  const debug =
    process.env.DEBUG && process.env.DEBUG.toLowerCase() === 'true'
      ? true
      : false
  log('error', error)

  const { name, code, ...data } = error
  if (code !== 500) log('warn', error)
  else log('error', error)

  const payload = debug ? data : { message: data.message }
  return res.status(code).json({
    code: name,
    error: payload
  })
}

export const generateHash = async (str: string) => {
  return await bcrypt.hash(str, await bcrypt.genSalt(10))
}
export const verifyHash = async (str: string, hash: string) => {
  return await bcrypt.compare(str, hash)
}
export const generateToken = (id: string, payload: Record<string, string>) => {
  const key = process.env.PRIVATE_KEY
  const expiry = process.env.TOKEN_EXPIRY ?? '3d'
  const domain = process.env.DOMAIN
  const apiDomain = process.env.API_DOMAIN

  const regex = /^(\d+)([smhdw])$/
  const checks = expiry.match(regex)

  if (!checks || !checks[1] || !checks[2])
    throw new Error(
      'Invalid token expiry format found in environment variables! Use format like "5m", "1h", "3d".'
    )
  if (!key)
    throw new Error('500', {
      cause: 'PRIVATE_KEY is not set in environment variables'
    })

  const expAmount = parseInt(checks[1], 10)
  const expUnit: 's' | 'm' | 'h' | 'd' | 'w' = checks[2] as
    | 's'
    | 'm'
    | 'h'
    | 'd'
    | 'w'
  return {
    token: jwt.sign({ sub: id, iss: domain, aud: apiDomain, ...payload }, key, {
      expiresIn: expiry
    }),
    expiry: {
      amount: expAmount,
      unit: expUnit
    }
  }
}
