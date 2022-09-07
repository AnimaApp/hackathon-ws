import express from 'express';
import morgan from 'morgan';
import { validate, Joi } from 'express-validation';
import cors from 'cors';
import { sockets } from './db';

const app = express();
app.use(morgan('combined'));

app.use(cors());
app.use(express.json());

const FigmaPostRealtimePreviewValidation = {
  body: Joi.object({
    html: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};

app.get('/', async (req, res) => {
  res.send('Hello Anima!!');
});

app.post('/realtime/preview', validate(FigmaPostRealtimePreviewValidation, {}, {}), async (req, res) => {
  const { html, userId } = req.body;

  const userSockets = sockets[userId];
  if (!userSockets) {
    console.log('no user sockets');
    res.status(200).send('no user sockets');
    return
  }
  userSockets.forEach((socket) => {
    socket.emit('realtime-preview', { html });
  });

  res.status(200).send('ok');
});

export default app;