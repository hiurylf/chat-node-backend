import { Message as MessageModel } from '@prisma/client';
import { prismaClient } from '../../database/prismaClient';
import {
  messageCreateSchema,
  IMessageCreateSchema,
} from '../schema/message-create';

class MessageService {
  selectDefault = {
    text: true,
    createdAt: true,
    id: true,
    user: { select: { userName: true } },
  };

  async create(body: IMessageCreateSchema): Promise<Partial<MessageModel>> {
    const { text, userId } = await messageCreateSchema.parse(body);

    return prismaClient.message.create({
      data: { text, userId },
      select: this.selectDefault,
    });
  }

  async findMany(): Promise<Partial<MessageModel>[]> {
    return prismaClient.message.findMany({ select: this.selectDefault });
  }
}

const messageService = new MessageService();
export { messageService };
