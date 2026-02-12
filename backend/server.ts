import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import CONFIG from './config';
import { registerSocketEvents } from './src/sockets/socket.events';

const startServer = () => {
  try {
    const app = express();
    const router = express.Router();

    const httpServer = http.createServer(app);
    const io = new IOServer(httpServer);

    app.use(router);
    app.use(cors({ origin: '*' }));

    io.on('connection', (socket) => {
      console.log(`New client connected: ${socket.id}`);
      registerSocketEvents(io, socket);
    });

    httpServer.listen(CONFIG.PORT, () => {
      console.log(`Server listening on *:${CONFIG.PORT} 🚀`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
