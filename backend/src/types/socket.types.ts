export type UserId = string;

export interface ActiveChat {
  chatId: string;
  partnerId: UserId;
}

export interface RegisterPayload {
  userId: UserId;
}

export interface ChatRequestPayload {
  fromUserId: UserId;
  toUserId: UserId;
}

export interface ChatAcceptPayload {
  fromUserId: UserId;
  toUserId: UserId;
}

export interface ChatDeclinePayload {
  fromUserId: UserId;
  toUserId: UserId;
}

export interface ChatRequestCancelPayload {
  fromUserId: UserId;
  toUserId: UserId;
}

export interface SendMessagePayload {
  chatId: string;
  fromUserId: UserId;
  toUserId: UserId;
  message: string;
}
