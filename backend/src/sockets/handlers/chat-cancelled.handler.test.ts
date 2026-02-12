import { beforeEach, describe, expect, it, vi } from 'vitest';
import { onlineUsersStore } from '../../state/online.store';
import { SOCKET_EVENTS } from '../socket.constants';
import { chatRequestCancelledHandler } from './chat-cancelled.handler';

describe('chatCancelledHandler', () => {
  let io: any;
  let socket: any;

  beforeEach(() => {
    vi.restoreAllMocks();

    io = { to: vi.fn(() => ({ emit: vi.fn() })) };
    socket = { on: vi.fn(), emit: vi.fn() };
  });

  it('should emit CHAT_REQUEST_CANCELLED to the target user if online', () => {
    const targetSocketId = 'socket123';

    const toSocketEmit = vi.fn();
    io.to = vi.fn((socketId: string) => {
      if (socketId === targetSocketId) return { emit: toSocketEmit };
      return { emit: vi.fn() };
    });

    vi.spyOn(onlineUsersStore, 'getSocketId').mockReturnValue(targetSocketId);

    chatRequestCancelledHandler(io, socket);

    const callback = (socket.on as any).mock.calls.find(
      (call: any) => call[0] === SOCKET_EVENTS.CHAT_REQUEST_CANCELLED
    )[1];
    const payload = { fromUserId: 'user1', toUserId: 'user2' };
    callback(payload);

    expect(io.to).toHaveBeenCalledWith(targetSocketId);
    expect(toSocketEmit).toHaveBeenCalledWith(
      SOCKET_EVENTS.CHAT_REQUEST_CANCELLED,
      { cancelledBy: payload.fromUserId }
    );
  });

  it('should not emit if the target user is offline', () => {
    vi.spyOn(onlineUsersStore, 'getSocketId').mockReturnValue(undefined);

    chatRequestCancelledHandler(io, socket);

    const callback = (socket.on as any).mock.calls.find(
      (call: any) => call[0] === SOCKET_EVENTS.CHAT_REQUEST_CANCELLED
    )[1];
    const payload = { fromUserId: 'user1', toUserId: 'user2' };
    callback(payload);

    expect(io.to).not.toHaveBeenCalled();
  });
});
