import { beforeEach, describe, expect, it, vi } from 'vitest';
import { chatsStore } from '../../state/chats.store';
import { onlineUsersStore } from '../../state/online.store';
import { SOCKET_EVENTS } from '../socket.constants';
import { chatAcceptHandler } from './chat-accept.handler';

vi.mock('uuid', () => ({ v4: vi.fn(() => 'mocked-uuid') }));

describe('chatAcceptHandler', () => {
  let io: any;
  let socket: any;

  beforeEach(() => {
    io = { to: vi.fn(() => ({ emit: vi.fn() })) };
    socket = { on: vi.fn(), emit: vi.fn() };

    vi.clearAllMocks();
  });

  it('should emit error if either user is offline', () => {
    vi.spyOn(onlineUsersStore, 'getSocketId')
      .mockReturnValueOnce(null)
      .mockReturnValueOnce('to-socket-id');

    chatAcceptHandler(io, socket);

    const callback = socket.on.mock.calls.find(
      (c) => c[0] === SOCKET_EVENTS.CHAT_ACCEPT
    )[1];

    callback({ fromUserId: 'user1', toUserId: 'user2' });

    expect(socket.emit).toHaveBeenCalledWith(SOCKET_EVENTS.ERROR, {
      message: 'One user is offline'
    });
  });

  it('should start chat if both users are online', () => {
    const fromSocketEmit = vi.fn();
    const toSocketEmit = vi.fn();

    vi.spyOn(onlineUsersStore, 'getSocketId')
      .mockReturnValueOnce('from-socket-id')
      .mockReturnValueOnce('to-socket-id');

    io.to = vi.fn((socketId: string) => {
      if (socketId === 'from-socket-id') return { emit: fromSocketEmit };
      if (socketId === 'to-socket-id') return { emit: toSocketEmit };
      return { emit: vi.fn() };
    });

    const chatsSetSpy = vi.spyOn(chatsStore, 'set');

    chatAcceptHandler(io, socket);

    const callback = socket.on.mock.calls.find(
      (c) => c[0] === SOCKET_EVENTS.CHAT_ACCEPT
    )[1];

    const payload = { fromUserId: 'user1', toUserId: 'user2' };
    callback(payload);

    expect(chatsSetSpy).toHaveBeenCalledWith('user1', 'mocked-uuid', 'user2');
    expect(chatsSetSpy).toHaveBeenCalledWith('user2', 'mocked-uuid', 'user1');

    expect(fromSocketEmit).toHaveBeenCalledWith(SOCKET_EVENTS.CHAT_STARTED, {
      chatId: 'mocked-uuid',
      partnerId: 'user2'
    });

    expect(toSocketEmit).toHaveBeenCalledWith(SOCKET_EVENTS.CHAT_STARTED, {
      chatId: 'mocked-uuid',
      partnerId: 'user1'
    });
  });
});
