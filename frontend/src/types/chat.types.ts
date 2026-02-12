export type ConntionStatus = 'connecting' | 'declined';
export type IncomingRequestStatus = 'pending' | 'cancelled';

export interface Message {
  fromUserId: string;
  message: string;
}

export interface ChatEndedPayload {
  chatId: string;
  endedBy: string;
  reason: 'manual' | 'disconnected';
}

export interface ChatEndedState {
  endedBy: string;
  reason: 'manual' | 'disconnected';
}

export interface ChatLocationState {
  userId: string;
  partnerId: string;
  chatId: string;
}
