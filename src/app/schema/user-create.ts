import { z } from 'zod';
import bcrypt from 'bcrypt';

/**
 * Create Schema
 **/
export const userCreateSchema = z.object({
  name: z.string({ required_error: 'O campo nome é obrigatório' }),
  userName: z
    .string({ required_error: 'O nome de usuário é obrigatório' })
    .transform((name) => name.replaceAll(' ', '')),
  password: z
    .string({ required_error: 'A senha é obrigatória' })
    .transform(async (password) => await bcrypt.hash(password, 8)),
});

export type IUserCreateSchema = z.infer<typeof userCreateSchema>;

/**
 * Login Schema
 **/
export const userLoginSchema = z.object({
  userName: z
    .string({ required_error: 'O nome de usuário é obrigatório' })
    .transform((name) => name.replaceAll(' ', '')),
  password: z
    .string({ required_error: 'A senha é obrigatória' })
    .transform(async (password) => await bcrypt.hash(password, 8)),
});

export type IUserLoginSchema = z.infer<typeof userLoginSchema>;
