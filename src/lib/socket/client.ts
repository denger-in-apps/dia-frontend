import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001";

let sosSocket: Socket | null = null;

export function getSosSocket(): Socket {
  if (!sosSocket) {
    sosSocket = io(`${SOCKET_URL}/sos`, {
      withCredentials: true,
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return sosSocket;
}
