import { Request, Response } from 'express';
import { messageService } from '../services/message.service';
import { handleResponseError } from '../services/utils.service';

class MessageController {
  async create(request: Request, response: Response): Promise<Response> {
    try {
      const user = await messageService.create(request.body);

      return response.status(201).json(user);
    } catch (error) {
      return handleResponseError(response, error);
    }
  }

  async findMany(request: Request, response: Response): Promise<Response> {
    try {
      const users = await messageService.findMany();

      return response.json(users);
    } catch (error) {
      return handleResponseError(response, error);
    }
  }
}

const messageController = new MessageController();

export { messageController };
