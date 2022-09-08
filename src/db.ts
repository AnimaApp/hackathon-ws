import { Socket } from 'socket.io';

export const userSockets: Map<string, Set<Socket>> = new Map();
