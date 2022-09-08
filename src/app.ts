import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import { validate, Joi } from 'express-validation';

import { userSockets } from './db';

const requiredString = Joi.string().required();

const LivePreviewUpdateValidation = {
  body: Joi.object({ html: requiredString, userId: requiredString }),
};

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '100mb' }));

app.get('/', async (_req, res) => res.send('Hello Anima!!'));

app.post('/live-preview', validate(LivePreviewUpdateValidation), async (req, res) => {
  const { html, userId } = req.body;

  userSockets.get(userId)?.forEach((socket) => socket.emit('live-preview-update', { html }));

  res.status(200).send('ok');
});

export default app;
