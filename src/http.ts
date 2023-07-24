import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { privateRouters } from './routes/private';
import { publicRouters } from './routes/public';
import passport from 'passport';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const corsConfig = cors();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(corsConfig);
app.use(passport.initialize());

app.use(publicRouters);
app.use(passport.authenticate('jwt', { session: false }), privateRouters);

app.use((error, req, res, _next) => {
  res.status(res.statusCode || 500);
  res.json(error);
});

const serverHttp = http.createServer(app);
const io = new Server(serverHttp, { cors: { ...corsConfig } });

export { serverHttp, io };
