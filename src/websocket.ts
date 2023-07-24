import { io } from './http';
import jwt from 'jsonwebtoken';
import process from 'process';
import { messageService } from './app/services/message.service';
import { userService } from './app/services/user.service';

let connectedUsers: { userId: string; socketId: string }[] = [];

const userWithStatus = (users: any[]) => {
  return users.map((user) => {
    const isConnected = connectedUsers.find((el) => el.userId === user.id);
    user.status = !!isConnected;
    return user;
  });
};

userService.newUserEvent$.subscribe(async () => {
  io.emit('users', userWithStatus(await userService.findMany()));
});

io.on('connection', async (socket) => {
  const token = socket.handshake.auth.token;
  const verify: any = jwt.verify(token, process.env.API_SECRET!);

  if (verify) {
    if (!connectedUsers.find((connect) => connect.userId === verify.id)) {
      connectedUsers.push({ userId: verify.id, socketId: socket.id });
    }

    const messages = await messageService.findMany();
    socket.emit('messages', messages);

    const users = await userService.findMany();
    io.emit('users', userWithStatus(users));

    socket.on('new-message', async (text: string) => {
      const newMessage = await messageService.create({
        text,
        userId: verify.id,
      });

      socket.broadcast.emit('new-message', newMessage);

      const messages = await messageService.findMany();
      io.emit('messages', messages);
    });

    socket.on('disconnect', () => {
      connectedUsers = connectedUsers.filter(
        (connect) => connect.userId !== verify.id,
      );

      io.emit('users', userWithStatus(users));
    });
  }
});
