import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { handleResponseError } from '../services/utils.service';

class UserController {
  async create(request: Request, response: Response): Promise<Response> {
    try {
      const user = await userService.create(request.body);

      return response.status(201).json(user);
    } catch (error) {
      return handleResponseError(response, error);
    }
  }

  async findMany(request: Request, response: Response): Promise<Response> {
    try {
      const users = await userService.findMany();

      return response.json(users);
    } catch (error) {
      return handleResponseError(response, error);
    }
  }
}

const userController = new UserController();

export { userController };
