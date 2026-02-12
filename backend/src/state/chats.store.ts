import { ActiveChat } from '../types/socket.types';

const activeChats = new Map<string, ActiveChat>();

export const chatsStore = {
  set(userId: string, chatId: string, partnerId: string) {
    activeChats.set(userId, { chatId, partnerId });
  },

  get(userId: string): ActiveChat | undefined {
    return activeChats.get(userId);
  },

  remove(userId: string) {
    activeChats.delete(userId);
  },

  removeBoth(userId: string) {
    const chat = activeChats.get(userId);
    if (!chat) return;
    activeChats.delete(userId);
    activeChats.delete(chat.partnerId);
  },

  exists(userId: string) {
    return activeChats.has(userId);
  }
};
