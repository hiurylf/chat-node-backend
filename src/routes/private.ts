import { Router } from 'express';
import { userController } from '../app/controllers/user.controller';
import { messageController } from '../app/controllers/message.controller';

const privateRouters = Router();

// Message Routes
privateRouters.post('/message', messageController.create);
privateRouters.get('/message', messageController.findMany);

// User Routes
privateRouters.post('/user', userController.create);
privateRouters.get('/user', userController.findMany);

export { privateRouters };
