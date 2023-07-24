import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import * as process from 'process';

class AuthMiddleware {
  async signup(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> {
    passport.authenticate('signup', (err, user, info) => {
      if (err || !user) {
        return response.status(400).json(err || info);
      }

      return next();
    })(request, response, next);
  }

  async login(request: Request, response: Response, next: NextFunction) {
    passport.authenticate('login', async (err, user, info) => {
      try {
        if (err || !user) {
          const error = new Error(err || info);

          response.status(user ? 500 : 400);

          return next(
            user
              ? error
              : 'Usuário não encontrado, verifique se o seu nome de usuário está correto',
          );
        }

        request.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const { password: _password, ...body } = user || ({} as any);

          const token = jwt.sign(body, process.env.API_SECRET!);

          return response.json({ token, user });
        });
      } catch (error) {
        return next(error);
      }
    })(request, response, next);
  }
}

const authMiddleware = new AuthMiddleware();

export { authMiddleware };
