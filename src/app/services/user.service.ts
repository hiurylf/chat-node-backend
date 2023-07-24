import { User as UserModel } from '@prisma/client';
import { prismaClient } from '../../database/prismaClient';
import { IUserCreateSchema, userCreateSchema } from '../schema/user-create';
import { Subject } from 'rxjs';

class UserService {
  newUserEvent$ = new Subject<void>();
  selectDefault = { name: true, userName: true, id: true, createdAt: true };

  async create(body: IUserCreateSchema): Promise<Omit<UserModel, 'password'>> {
    const { userName, name, password } = await userCreateSchema.parseAsync(
      body,
    );

    const hasUserName = await prismaClient.user.findUnique({
      where: { userName: userName },
    });

    if (hasUserName) {
      throw new Error('Este nome de usuário está em uso, tente outro.');
    }

    const user = await prismaClient.user.create({
      data: { userName, name, password },
      select: this.selectDefault,
    });

    this.newUserEvent$.next();

    return user;
  }

  async findMany(): Promise<Omit<UserModel, 'password'>[]> {
    return prismaClient.user.findMany({ select: this.selectDefault });
  }

  async findOneByUserName(userName: string): Promise<UserModel | null> {
    return prismaClient.user.findUnique({
      select: { ...this.selectDefault, password: true },
      where: { userName },
    });
  }
}

const userService = new UserService();
export { userService };
