import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

/**
 * Custom React hook to subscribe to a Socket.IO event and automatically
 * clean up the listener when the component unmounts or dependencies change.
 *
 * @param {Socket} socket - The Socket.IO client instance.
 * @param {string} event - The name of the socket event to listen for.
 * @param {(payload: T) => void} handler - Callback function invoked when the event is received.
 */
export const useSocketEvent = <T>(socket: Socket, event: string, handler: (payload: T) => void) => {
  useEffect(() => {
    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
};
