import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'nextjs-enrollment.vercel.app';
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer,{
    path: '/socket.io', // Ensure this path matches your client-side connection
    cors: {
      // origin: '*',
      origin: 'https://nextjs-enrollment.vercel.app',
      methods: ['GET', 'POST']
    }
  }
);

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('refresh-data', (data) => {
      console.log('Received refresh-data event:', data);
      io.emit('refresh-data', data); // Broadcast to all clients
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
