import type { Request, Response } from 'express';
import type { ControllerError } from '../types'

import { createUser, login, getAuthToken } from '../controllers/user.controller';
import { parseError, sendResponse, sendErrorResponse } from '../utils';

const registerHandler = async (req: Request, res: Response) => {
  try {
    console.log("Incoming request:", req.body); 
    const { firstName, lastName, fullName, email, password, phone } = req.body;
    const user = await createUser({
      firstName: firstName ? firstName : fullName.split(' ')[0],
      lastName: lastName ? lastName : fullName.split(' ')[1],
      email,
      password,
      phone,
      role: 'user'
    });
    return sendResponse(res, 201, user);
  } catch (error) {
    if (error instanceof Error) return sendErrorResponse(res, parseError(error));
    else return sendErrorResponse(res, error as ControllerError);
  }
};

const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await login({ email, password });
    return sendResponse(res, 200, user);
  } catch (error) {
    if (error instanceof Error) return sendErrorResponse(res, parseError(error));
    else return sendErrorResponse(res, error as ControllerError);
  }
};

export default { registerHandler, loginHandler };
