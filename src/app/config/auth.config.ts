import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import {
  Strategy as JWTStrategy,
  ExtractJwt as ExtractJWT,
} from 'passport-jwt';
import { Request } from 'express';
import { userService } from '../services/user.service';
import { userLoginSchema } from '../schema/user-create';
import * as process from 'process';

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.API_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token);
      } catch (error) {
        done(error);
      }
    },
  ),
);

passport.use(
  'signup',
  new LocalStrategy(
    {
      passReqToCallback: true,
      session: false,
      passwordField: 'password',
      usernameField: 'userName',
    },
    async (request: Request, username, password, done) => {
      try {
        const user = await userService.create(request.body);
        return done(null, user);
      } catch (error: Error | any) {
        done(error?.message || error);
      }
    },
  ),
);

passport.use(
  'login',
  new LocalStrategy(
    {
      session: false,
      passwordField: 'password',
      usernameField: 'userName',
    },
    async (reqUserName, reqPassword, done) => {
      try {
        const { userName } = await userLoginSchema.parseAsync({
          userName: reqUserName,
          password: reqPassword,
        });

        const user = await userService.findOneByUserName(userName);

        if (!user) {
          return done(null, false, { message: 'Usuário não encontrado' });
        }

        const validate = await bcrypt.compare(reqPassword, user.password);

        if (!validate) {
          return done(null, false, { message: 'Senha errada' });
        }

        return done(null, user, { message: 'Login realizado com sucesso' });
      } catch (error) {
        return done(error);
      }
    },
  ),
);
