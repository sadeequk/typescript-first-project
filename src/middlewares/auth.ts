import type { ControllerError } from '../types'

import { Request, Response, NextFunction } from 'express'
// import { getUser } from '../controllers/user.controller'
import { decodeToken, parseError, sendErrorResponse } from '../utils/index'

const getPayload = (token?: string | null) => {
  try {
    if (!token || token.length === 0)
      throw new Error('401', { cause: 'No authentication token provided' })

    const data = decodeToken(token)
    if (!data)
      throw new Error('401', {
        cause: 'Invalid token provided! Please login again'
      })

    const { id, email, role } = data.payload as {
      id?: string
      email?: string
      role?: 'super' | 'admin' | 'user'
    }
    if (!id || !email || !role || !['super', 'admin', 'user'].includes(role))
      throw new Error('401', {
        cause: 'Invalid token provided! Please login again'
      })

    return { id, email, role }
  } catch (error) {
    if (error instanceof Error) throw parseError(error)
    else throw error
  }
}

const auth =
  (roles: ('super' | 'admin' | 'user')[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers['authorization']
      const token = authHeader ? authHeader.split(' ')[1] : null

      const { id, email, role } = getPayload(token)

    //   const user = await getUser({ id: id })
    //   if (!user.verified)
    //     throw new Error('405', {
    //       cause: 'Please verify your email to continue!'
    //     })
    //   if (user.suspended)
    //     throw new Error('405', {
    //       cause:
    //         'Your account is suspended! Please contact admin for more details'
    //     })
    //   if (!roles.includes(user.role))
    //     throw new Error('403', {
    //       cause: 'You are not allowed to perform this action!'
    //     })

    //   req.auth = { id, email, role }
      return next()
    } catch (error) {
      if (error instanceof Error)
        return sendErrorResponse(res, parseError(error))
      else return sendErrorResponse(res, error as ControllerError)
    }
  }

export default auth
