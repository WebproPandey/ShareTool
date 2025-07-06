import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
let socketInstance = null;

export function createSocket() {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: true,
    });

    socketInstance.on('connect_error', (err) => {
      console.error('[Socket connect_error]', err);
    });
    socketInstance.on('error', (err) => {
      console.error('[Socket error]', err);
    });
    socketInstance.on('disconnect', (reason) => {
      console.warn('[Socket disconnect]', reason);
    });
    socketInstance.on('reconnect_failed', () => {
      console.error('[Socket reconnect_failed]');
    });
  }
  return socketInstance;
}