import { Socket } from "socket.io";

export const sockets: { [key: string]: Set<Socket> } = {};
