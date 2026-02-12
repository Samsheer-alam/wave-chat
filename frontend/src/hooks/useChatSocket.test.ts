import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useChatSocket } from './useChatSocket';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

// Mock socket
vi.mock('../sockets/socket', () => ({
  socket: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
  }
}));

// Mock SOCKET_EVENTS
vi.mock('../sockets/socket.event', () => ({
  SOCKET_EVENTS: {
    MESSAGE_SEND: 'message:send',
    MESSAGE_RECEIVED: 'message:received',
    CHAT_END: 'chat:end',
    CHAT_ENDED: 'chat:ended'
  }
}));

// Mock useSocketEvent hook
vi.mock('./useSocketEvent', () => ({
  useSocketEvent: vi.fn((socket, event, handler) => {
    socket.on(event, handler);
  })
}));

// Import after mocks
import { socket } from '../sockets/socket';
import { SOCKET_EVENTS } from '../sockets/socket.event';

describe('useChatSocket', () => {
  const chatId = 'chat-123';
  const userId = 'user-1';
  const partnerId = 'user-2';

  let mockSocketEmit: any;
  let mockSocketOn: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSocketEmit = socket.emit as any;
    mockSocketOn = socket.on as any;
  });

  describe('Return values', () => {
    it('returns all expected properties and functions', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      expect(result.current).toHaveProperty('messages');
      expect(result.current).toHaveProperty('chatEndedInfo');
      expect(result.current).toHaveProperty('sendMessage');
      expect(result.current).toHaveProperty('endChat');
      expect(result.current).toHaveProperty('handleChatEndModal');
    });
  });

  describe('Initialization', () => {
    it('initializes with empty messages array', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      expect(result.current.messages).toEqual([]);
    });

    it('initializes with null chatEndedInfo', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      expect(result.current.chatEndedInfo).toBeNull();
    });

    it('registers MESSAGE_RECEIVED socket event listener', () => {
      renderHook(() => useChatSocket(chatId, userId, partnerId));

      expect(mockSocketOn).toHaveBeenCalledWith(
        SOCKET_EVENTS.MESSAGE_RECEIVED,
        expect.any(Function)
      );
    });

    it('registers CHAT_ENDED socket event listener', () => {
      renderHook(() => useChatSocket(chatId, userId, partnerId));

      expect(mockSocketOn).toHaveBeenCalledWith(SOCKET_EVENTS.CHAT_ENDED, expect.any(Function));
    });
  });

  describe('sendMessage', () => {
    it('emits MESSAGE_SEND event with correct payload', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      act(() => {
        result.current.sendMessage('Hello there!');
      });

      expect(mockSocketEmit).toHaveBeenCalledWith(SOCKET_EVENTS.MESSAGE_SEND, {
        chatId: 'chat-123',
        fromUserId: 'user-1',
        toUserId: 'user-2',
        message: 'Hello there!'
      });
    });

    it('adds message to local messages state', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      act(() => {
        result.current.sendMessage('Test message');
      });

      expect(result.current.messages).toEqual([
        {
          fromUserId: 'user-1',
          message: 'Test message'
        }
      ]);
    });

    it('does not send empty messages', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      act(() => {
        result.current.sendMessage('');
      });

      expect(mockSocketEmit).not.toHaveBeenCalled();
      expect(result.current.messages).toEqual([]);
    });

    it('sends multiple messages and updates state correctly', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      act(() => {
        result.current.sendMessage('First message');
        result.current.sendMessage('Second message');
        result.current.sendMessage('Third message');
      });

      expect(result.current.messages).toHaveLength(3);
      expect(result.current.messages).toEqual([
        { fromUserId: 'user-1', message: 'First message' },
        { fromUserId: 'user-1', message: 'Second message' },
        { fromUserId: 'user-1', message: 'Third message' }
      ]);
    });
  });

  describe('endChat', () => {
    it('emits CHAT_END event', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      act(() => {
        result.current.endChat();
      });

      expect(mockSocketEmit).toHaveBeenCalledWith(SOCKET_EVENTS.CHAT_END);
    });

    it('navigates to home page with replace', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      act(() => {
        result.current.endChat();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  describe('handleChatEndModal', () => {
    it('resets chatEndedInfo to null', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      // First set chatEndedInfo
      act(() => {
        // Simulate receiving chat ended event
        const chatEndedHandler = mockSocketOn.mock.calls.find(
          (call: any) => call[0] === SOCKET_EVENTS.CHAT_ENDED
        )?.[1];

        chatEndedHandler?.({
          endedBy: 'user-2',
          reason: 'User left'
        });
      });

      expect(result.current.chatEndedInfo).not.toBeNull();

      // Then close modal
      act(() => {
        result.current.handleChatEndModal();
      });

      expect(result.current.chatEndedInfo).toBeNull();
    });

    it('navigates to home page with replace', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      act(() => {
        result.current.handleChatEndModal();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  describe('handleMessageReceived', () => {
    it('adds received message to messages array', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      // Get the MESSAGE_RECEIVED handler
      const messageReceivedHandler = mockSocketOn.mock.calls.find(
        (call: any) => call[0] === SOCKET_EVENTS.MESSAGE_RECEIVED
      )?.[1];

      act(() => {
        messageReceivedHandler?.({
          fromUserId: 'user-2',
          message: 'Hello from partner!'
        });
      });

      expect(result.current.messages).toEqual([
        {
          fromUserId: 'user-2',
          message: 'Hello from partner!'
        }
      ]);
    });

    it('handles multiple received messages', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      const messageReceivedHandler = mockSocketOn.mock.calls.find(
        (call: any) => call[0] === SOCKET_EVENTS.MESSAGE_RECEIVED
      )?.[1];

      act(() => {
        messageReceivedHandler?.({
          fromUserId: 'user-2',
          message: 'Message 1'
        });
        messageReceivedHandler?.({
          fromUserId: 'user-2',
          message: 'Message 2'
        });
      });

      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages).toEqual([
        { fromUserId: 'user-2', message: 'Message 1' },
        { fromUserId: 'user-2', message: 'Message 2' }
      ]);
    });

    it('maintains correct order of sent and received messages', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      const messageReceivedHandler = mockSocketOn.mock.calls.find(
        (call: any) => call[0] === SOCKET_EVENTS.MESSAGE_RECEIVED
      )?.[1];

      act(() => {
        result.current.sendMessage('My message 1');
        messageReceivedHandler?.({
          fromUserId: 'user-2',
          message: 'Partner message 1'
        });
        result.current.sendMessage('My message 2');
      });

      expect(result.current.messages).toEqual([
        { fromUserId: 'user-1', message: 'My message 1' },
        { fromUserId: 'user-2', message: 'Partner message 1' },
        { fromUserId: 'user-1', message: 'My message 2' }
      ]);
    });
  });

  describe('handleChatEnded', () => {
    it('sets chatEndedInfo when partner ends the chat', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      const chatEndedHandler = mockSocketOn.mock.calls.find(
        (call: any) => call[0] === SOCKET_EVENTS.CHAT_ENDED
      )?.[1];

      act(() => {
        chatEndedHandler?.({
          endedBy: 'user-2',
          reason: 'User disconnected'
        });
      });

      expect(result.current.chatEndedInfo).toEqual({
        endedBy: 'user-2',
        reason: 'User disconnected'
      });
    });

    it('ignores CHAT_ENDED event when current user ended it', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      const chatEndedHandler = mockSocketOn.mock.calls.find(
        (call: any) => call[0] === SOCKET_EVENTS.CHAT_ENDED
      )?.[1];

      act(() => {
        chatEndedHandler?.({
          endedBy: 'user-1', // Current user
          reason: 'User left'
        });
      });

      expect(result.current.chatEndedInfo).toBeNull();
    });

    it('updates chatEndedInfo with different reasons', () => {
      const { result } = renderHook(() => useChatSocket(chatId, userId, partnerId));

      const chatEndedHandler = mockSocketOn.mock.calls.find(
        (call: any) => call[0] === SOCKET_EVENTS.CHAT_ENDED
      )?.[1];

      act(() => {
        chatEndedHandler?.({
          endedBy: 'user-2',
          reason: 'Connection lost'
        });
      });

      expect(result.current.chatEndedInfo?.reason).toBe('Connection lost');

      act(() => {
        result.current.handleChatEndModal();
      });

      expect(result.current.chatEndedInfo).toBeNull();

      act(() => {
        chatEndedHandler?.({
          endedBy: 'user-2',
          reason: 'User logged out'
        });
      });

      expect(result.current.chatEndedInfo?.reason).toBe('User logged out');
    });
  });
});
