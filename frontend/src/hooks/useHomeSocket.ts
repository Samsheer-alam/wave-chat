import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../sockets/socket';
import { SOCKET_EVENTS } from '../sockets/socket.event';
import { ConntionStatus, IncomingRequestStatus } from '../types/chat.types';
import { useSocketEvent } from './useSocketEvent';

/**
 * Custom hook to handle socket logic for the Home screen.
 * @param {string} userId - The unique identifier of the currently logged-in user.
 *
 * @returns {{
 *   incomingRequest: string | null;
 *   incomingRequestStatus: IncomingRequestStatus;
 *   connectingTo: string | null;
 *   connectionStatus: ConntionStatus;
 *   requestChat: (partnerId: string) => void;
 *   acceptChatRequest: () => void;
 *   declineChatRequest: () => void;
 *   cancelConnection: () => void;
 * }}
 * An object containing state values and handler functions for managing chat connections on the Home screen.
 */
export const useHomeSocket = (userId: string) => {
  const navigate = useNavigate();
  const [incomingRequest, setIncomingRequest] = useState<string | null>(null);
  const [connectingTo, setConnectingTo] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConntionStatus>('connecting');
  const [incomingRequestStatus, setIncomingRequestStatus] =
    useState<IncomingRequestStatus>('pending');

  /**
   * Establish socket connection (if not already connected) and register the current user on mount.
   */
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit(SOCKET_EVENTS.REGISTER, { userId });
  }, [userId]);

  /**
   * Sends a chat request to another user.
   * @param {string} partnerId - The userId of the person to start a chat with.
   */
  const requestChat = (partnerId: string) => {
    if (!partnerId.trim()) return;

    setConnectionStatus('connecting');
    setConnectingTo(partnerId);

    socket.emit(SOCKET_EVENTS.CHAT_REQUEST, {
      fromUserId: userId,
      toUserId: partnerId
    });
  };

  /**
   * Accepts the current incoming chat request.
   * Emits a `CHAT_ACCEPT` event to the server *
   * After emitting the event, it clears the `incomingRequest` state to reset the UI.
   */
  const acceptChatRequest = () => {
    if (incomingRequest) {
      socket.emit(SOCKET_EVENTS.CHAT_ACCEPT, {
        fromUserId: incomingRequest,
        toUserId: userId
      });
      setIncomingRequest(null);
    }
  };

  /**
   * Declines the current incoming chat request.
   * Emits a `CHAT_DECLINED` event to notify the requester that the chat was rejected.
   * Regardless of whether the emit occurs, it clears the`incomingRequest` state to reset the UI.
   */
  const declineChatRequest = () => {
    if (incomingRequest) {
      socket.emit(SOCKET_EVENTS.CHAT_DECLINED, {
        fromUserId: incomingRequest,
        toUserId: userId
      });
    }
    setIncomingRequest(null);
  };

  /**
   * Cancels the current outgoing chat connection attempt.
   */
  const cancelConnection = () => {
    console.log('Cancelling connection to', connectingTo);
    if (connectingTo) {
      socket.emit(SOCKET_EVENTS.CHAT_REQUEST_CANCELLED, {
        fromUserId: userId,
        toUserId: connectingTo
      });
    }
    setConnectingTo(null);
    setConnectionStatus('connecting');
  };

  /**
   * Handles an incoming chat request event.
   * Triggered when another user sends a chat request.
   * Clears any active outgoing connection attempt and
   * stores the sender's userId as an incoming request.
   *
   * @param {{ fromUserId: string }} payload - Event payload containing sender ID
   */
  const handleChatRequest = useCallback(({ fromUserId }: { fromUserId: string }) => {
    setConnectingTo(null);
    setIncomingRequestStatus('pending');
    setIncomingRequest(fromUserId);
  }, []);

  /**
   * Handles successful chat initialization.
   * Triggered when the server confirms a chat session has started.
   * Resets connection state and navigates to the chat screen.
   *
   * @param {{ chatId: string; partnerId: string }} payload - Chat session details
   */
  const handleChatStarted = useCallback(
    ({ chatId, partnerId }: { chatId: string; partnerId: string }) => {
      setConnectingTo(null);
      setConnectionStatus('connecting');
      navigate(`/chat/${userId}`, {
        state: { chatId, partnerId, userId }
      });
    },
    [navigate, userId]
  );

  /**
   * Handles socket error events.
   * Clears any active connection attempt and logs
   * the error message for debugging purposes.
   *
   * @param {{ message: string }} payload - Error message from server
   */
  const handleError = useCallback(({}: { message: string }) => {
    setConnectingTo(null);
  }, []);

  /**
   * Handles chat decline event.
   * Updates connection status to "declined" and
   * automatically resets the connection state after 5 seconds.
   */
  const handleChatDeclined = useCallback(() => {
    setConnectionStatus('declined');
    setTimeout(() => {
      setConnectingTo(null);
      setConnectionStatus('connecting');
    }, 5000);
  }, []);

  /**
   * Handles chat request cancellation event.
   * Updates incoming request status to "cancelled" and
   * automatically resets the incoming request state after 5 seconds.
   */
  const handleChatRequestCancelled = useCallback(() => {
    setIncomingRequestStatus('cancelled');
    setTimeout(() => {
      setIncomingRequest(null);
      setIncomingRequestStatus('pending');
    }, 5000);
  }, []);

  /**
   * Register socket event listeners using the reusable hook, for home screen specific events.
   */
  useSocketEvent(socket, SOCKET_EVENTS.CHAT_REQUEST_RECEIVED, handleChatRequest);
  useSocketEvent(socket, SOCKET_EVENTS.CHAT_STARTED, handleChatStarted);
  useSocketEvent(socket, SOCKET_EVENTS.CHAT_DECLINED, handleChatDeclined);
  useSocketEvent(socket, SOCKET_EVENTS.CHAT_REQUEST_CANCELLED, handleChatRequestCancelled);
  useSocketEvent(socket, SOCKET_EVENTS.ERROR, handleError);

  return {
    incomingRequest,
    incomingRequestStatus,
    connectingTo,
    connectionStatus,
    requestChat,
    acceptChatRequest,
    declineChatRequest,
    cancelConnection
  };
};
