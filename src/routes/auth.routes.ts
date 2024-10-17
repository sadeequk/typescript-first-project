import { Router ,Request,Response} from 'express';
import authHandler from '../handlers/auth.handler';
import authSchema from '../schemas/auth.schemas';
import validate from '../middlewares/validate';
import { sendResponse } from '../utils/index'
const authRoutes = Router();


authRoutes.post('/test', (req: Request, res: Response) => {
  console.log("Test route body:", req.body);  
  res.status(200).json({ message: "Test route hit successfully", data: req.body });
});
authRoutes.post('/registor', validate(authSchema.registerSchema), authHandler.registerHandler);
authRoutes.post('/login', validate(authSchema.loginSchema), authHandler.loginHandler);

export default authRoutes
