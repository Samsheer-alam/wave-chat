import { Socket } from 'socket.io';
import { onlineUsersStore } from '../../state/online.store';
import type { RegisterPayload } from '../../types/socket.types';
import { SOCKET_EVENTS } from '../socket.constants';

/**
 * Registers a listener for `REGISTER` that stores the user's socket and confirms registration.
 * @param socket - The user's socket instance on which to listen for events.
 */
export const registerHandler = (socket: Socket) => {
  socket.on(SOCKET_EVENTS.REGISTER, (payload: RegisterPayload) => {
    onlineUsersStore.set(payload.userId, socket.id);

    socket.emit(SOCKET_EVENTS.REGISTERED, {
      userId: payload.userId,
      socketId: socket.id
    });
  });
};
