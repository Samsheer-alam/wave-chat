import { Server, Socket } from 'socket.io';
import { chatsStore } from '../../state/chats.store';
import { onlineUsersStore } from '../../state/online.store';
import { SOCKET_EVENTS } from '../socket.constants';

/**
 * Registers a listener for `CHAT_END` that ends the chat and notifies the partner if they are online.
 * @param io - The Socket.IO server instance used to emit events.
 * @param socket - The user's socket instance on which to listen for events.
 */
export const chatEndHandler = (io: Server, socket: Socket) => {
  socket.on(SOCKET_EVENTS.CHAT_END, () => {
    const userId = onlineUsersStore.findUserBySocketId(socket.id);
    if (!userId) return;

    const activeChat = chatsStore.get(userId);
    if (!activeChat) return;

    const partnerSocketId = onlineUsersStore.getSocketId(activeChat.partnerId);

    if (partnerSocketId) {
      io.to(partnerSocketId).emit(SOCKET_EVENTS.CHAT_ENDED, {
        chatId: activeChat.chatId,
        endedBy: userId,
        reason: 'manual'
      });
    }

    chatsStore.removeBoth(userId);
  });
};
