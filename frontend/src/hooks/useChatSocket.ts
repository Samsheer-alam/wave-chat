import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../sockets/socket';
import { SOCKET_EVENTS } from '../sockets/socket.event';
import { ChatEndedPayload, ChatEndedState, Message } from '../types/chat.types';
import { useSocketEvent } from './useSocketEvent';

/**
 * Custom hook to manage chat-related socket events and state for a single chat session.
 * @param {string} chatId - The unique identifier of the current chat session.
 * @param {string} userId - The ID of the currently logged-in user.
 * @param {string} partnerId - The ID of the chat partner.
 *
 * @returns {{
 *   messages: Message[];
 *   chatEndedInfo: ChatEndedState | null;
 *   sendMessage: (message: string) => void;
 *   endChat: () => void;
 *   handleChatEndModal: () => void;
 * }}
 * An object containing state values and handler functions for managing chat connections on the Chat screen.
 */
export const useChatSocket = (chatId: string, userId: string, partnerId: string) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatEndedInfo, setChatEndedInfo] = useState<ChatEndedState | null>(null);

  /**
   * Sends a chat message to the server and updates local state.
   * @param {string} message - The message text to send.
   */
  const sendMessage = (message: string) => {
    if (!message.trim()) return;

    socket.emit(SOCKET_EVENTS.MESSAGE_SEND, {
      chatId,
      fromUserId: userId,
      toUserId: partnerId,
      message
    });

    setMessages((prev) => [...prev, { fromUserId: userId, message }]);
  };

  /**
   * Ends the chat session manually and navigates back to the home page.
   * Emits a `CHAT_END` event to the server.
   */
  const endChat = () => {
    socket.emit(SOCKET_EVENTS.CHAT_END);
    navigate('/', { replace: true });
  };

  /**
   * Handles closing the "chat ended" modal.
   * Resets the `chatEndedInfo` state and navigates back to the home page.
   */
  const handleChatEndModal = () => {
    setChatEndedInfo(null);
    navigate('/', { replace: true });
  };

  /**
   * Handles receiving a new message from the server.
   * @param {Message} payload - The message object received from the server.
   */
  const handleMessageReceived = useCallback((payload: Message) => {
    setMessages((prev) => [...prev, payload]);
  }, []);

  /**
   * Handles the chat being ended by the partner. Ignores the event if the current user ended the chat.
   * @param {ChatEndedPayload} payload - Information about who ended the chat and why.
   */
  const handleChatEnded = useCallback(
    (payload: ChatEndedPayload) => {
      // Ignore if current user ended it
      if (payload.endedBy === userId) return;

      setChatEndedInfo({
        endedBy: payload.endedBy,
        reason: payload.reason
      });
    },
    [userId]
  );

  /**
   * Register socket event listeners using the reusable hook, for chat screen specific events.
   */
  useSocketEvent(socket, SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived);
  useSocketEvent(socket, SOCKET_EVENTS.CHAT_ENDED, handleChatEnded);

  return {
    messages,
    chatEndedInfo,
    sendMessage,
    endChat,
    handleChatEndModal
  };
};
