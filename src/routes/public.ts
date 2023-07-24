import { Router } from 'express';
import { authMiddleware } from '../app/middlewares/auth.middleware';
import '../app/config/auth.config';

const publicRouters = Router();

publicRouters.post('/signup', authMiddleware.signup, authMiddleware.login);
publicRouters.post('/login', authMiddleware.login);

export { publicRouters };
