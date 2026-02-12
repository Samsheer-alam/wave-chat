import { beforeEach, describe, expect, it } from 'vitest';
import { onlineUsersStore } from './online.store';

describe('onlineUsersStore', () => {
  beforeEach(() => {
    const testUsers = ['user1', 'user2', 'user3', 'userA', 'userB', 'userX'];
    testUsers.forEach((userId) => onlineUsersStore.remove(userId));
  });

  it('should add and get a socketId', () => {
    onlineUsersStore.set('user1', 'socket1');
    expect(onlineUsersStore.getSocketId('user1')).toBe('socket1');
  });

  it('should return undefined for unknown user', () => {
    expect(onlineUsersStore.getSocketId('unknown')).toBeUndefined();
  });

  it('should remove a user', () => {
    onlineUsersStore.set('user2', 'socket2');
    onlineUsersStore.remove('user2');
    expect(onlineUsersStore.getSocketId('user2')).toBeUndefined();
  });

  it('should find a user by socketId', () => {
    onlineUsersStore.set('user3', 'socket3');
    expect(onlineUsersStore.findUserBySocketId('socket3')).toBe('user3');
  });

  it('should return null if socketId not found', () => {
    expect(onlineUsersStore.findUserBySocketId('unknownSocket')).toBeNull();
  });

  it('should handle multiple users correctly', () => {
    onlineUsersStore.set('userA', 'socketA');
    onlineUsersStore.set('userB', 'socketB');

    expect(onlineUsersStore.getSocketId('userA')).toBe('socketA');
    expect(onlineUsersStore.getSocketId('userB')).toBe('socketB');
    expect(onlineUsersStore.findUserBySocketId('socketA')).toBe('userA');
    expect(onlineUsersStore.findUserBySocketId('socketB')).toBe('userB');

    onlineUsersStore.remove('userA');
    expect(onlineUsersStore.getSocketId('userA')).toBeUndefined();
    expect(onlineUsersStore.findUserBySocketId('socketA')).toBeNull();
  });
});
