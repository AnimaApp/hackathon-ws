import http from 'http';
import { Server } from 'socket.io';

import app from './app';
import { userSockets } from './db';

const PORT = process.env.PORT || '3000';

try {
  const server = http.createServer(app);
  const io = new Server(server);

  server
    .listen(PORT, () => console.log(`Server is listening on ${PORT}`))
    .on('error', console.error);

  io.on('connection', (socket) => {
    const { userId } = socket.handshake.query as { userId: string };

    socket.on('disconnect', () => userSockets.get(userId)?.delete(socket));

    if (!userId) return;
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());

    userSockets.get(userId)?.add(socket);
  });
} catch (error) {
  console.log(error);
}
