const onlineUsers = new Map<string, string>();

export const onlineUsersStore = {
  set(userId: string, socketId: string) {
    onlineUsers.set(userId, socketId);
  },

  getSocketId(userId: string) {
    return onlineUsers.get(userId);
  },

  remove(userId: string) {
    onlineUsers.delete(userId);
  },

  findUserBySocketId(socketId: string) {
    for (const [userId, storedSocketId] of onlineUsers.entries()) {
      if (storedSocketId === socketId) return userId;
    }
    return null;
  }
};
