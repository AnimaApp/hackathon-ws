import app from './app';
import { Server } from 'socket.io';
import { sockets } from './db'
import http from 'http';

const PORT = process.env.PORT || '3000';

const start = async () => {
  try {
    const server = http.createServer(app);
    const io = new Server(server);
    server
      .listen(PORT, () => {
        return console.log(`server is listening on ${PORT}`);
      })
      .on('error', (err) => {
        console.error(err);
      });

    io.on('connection', (socket) => {
      console.log('a user connected');

      const { userId } = socket.handshake.query as { userId: string };
      if (userId) {
        if (sockets[userId]) {
          sockets[userId].add(socket);
        } else {
          sockets[userId] = new Set([socket]);
        }
      }

      socket.on('disconnect', () => {
        console.log('a user disconnected1');
        if (userId) {
          sockets[userId].delete(socket);
        }
      });
    });

    io.on('message', (msg) => {
      console.log(msg)
    })
  } catch (error) {
    console.log(error);
  }
};

start()