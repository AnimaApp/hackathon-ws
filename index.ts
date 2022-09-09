import { Server } from 'socket.io';

let connectedPreviewers = 0;
const PORT = parseInt(process.env.PORT || '3000');

const events = {
  update: 'live-preview:update',
  willUpdate: 'live-preview:will-update',
  countChanged: 'live-preview:previewer-count-changed',
};

try {
  const io = new Server({
    maxHttpBufferSize: 1e8, // 100MB
  });

  io.listen(PORT).on('error', console.error);

  const livePreviewNS = io.of(/^.*$/);

  livePreviewNS.on('connection', (socket) => {
    const { tags = '' } = (socket.handshake.query || {}) as { tags?: string };

    tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .forEach((tag) => socket.join(tag));

    socket.onAny((type) => console.log('received a:', type));

    const previewers = livePreviewNS.in('previewer');
    const generators = livePreviewNS.in('generator');

    socket.on(events.willUpdate, () => previewers.emit(events.willUpdate));
    socket.on(events.update, (data) => previewers.emit(events.update, data));

    // Note: manually tracking the count won't work with multiple servers
    // Use the Redis adapter if we ever need to scale
    if (socket.rooms.has('previewer')) {
      generators.emit(events.countChanged, ++connectedPreviewers);
      socket.on('disconnect', async () => generators.emit(events.countChanged, --connectedPreviewers));
    }
  });
} catch (error) {
  console.log(error);
}
