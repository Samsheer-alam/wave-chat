import { Server, Socket } from 'socket.io';
import { onlineUsersStore } from '../../state/online.store';
import type { ChatDeclinePayload } from '../../types/socket.types';
import { SOCKET_EVENTS } from '../socket.constants';

/**
 * Registers a listener for `CHAT_DECLINED` that notifies the sender when their chat request is declined.
 * @param io - The Socket.IO server instance used to emit events.
 * @param socket - The user's socket instance on which to listen for events.
 */
export const chatDeclineHandler = (io: Server, socket: Socket) => {
  socket.on(SOCKET_EVENTS.CHAT_DECLINED, (payload: ChatDeclinePayload) => {
    const fromSocketId = onlineUsersStore.getSocketId(payload.fromUserId);

    if (fromSocketId) {
      io.to(fromSocketId).emit(SOCKET_EVENTS.CHAT_DECLINED, {
        declinedBy: payload.toUserId
      });
    }
  });
};
