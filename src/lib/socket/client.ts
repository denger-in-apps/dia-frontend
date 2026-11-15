import { io, Socket } from "socket.io-client";
import { getAccessToken } from "@/lib/api/client";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost";

let sosSocket: Socket | null = null;

export function getSosSocket(): Socket {
  if (!sosSocket) {
    sosSocket = io(`${SOCKET_URL}/psikolog`, {
      auth: (callback) => callback({ token: getAccessToken() }),
      withCredentials: true,
      autoConnect: false,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
  }
  return sosSocket;
}
