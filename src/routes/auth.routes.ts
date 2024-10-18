import { Router ,Request,Response} from 'express';
import authHandler from '../handlers/auth.handler';
import authSchema from '../schemas/auth.schemas';
import validate from '../middlewares/validate';
import { sendResponse } from '../utils/index'
const authRoutes = Router();

authRoutes.post('/registor', validate(authSchema.registerSchema), authHandler.registerHandler);
authRoutes.post('/login', validate(authSchema.loginSchema), authHandler.loginHandler);

export default authRoutes
