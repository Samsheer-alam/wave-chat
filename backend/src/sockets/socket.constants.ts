export const SOCKET_EVENTS = {
  REGISTER: 'user:register',
  REGISTERED: 'user:registered',

  CHAT_REQUEST: 'chat:request',
  CHAT_REQUEST_RECEIVED: 'chat:request-received',
  CHAT_REQUEST_CANCELLED: 'chat:request-cancelled',

  CHAT_ACCEPT: 'chat:accept',
  CHAT_STARTED: 'chat:started',
  CHAT_DECLINED: 'chat:declined',

  MESSAGE_SEND: 'message:send',
  MESSAGE_RECEIVED: 'message:received',

  CHAT_END: 'chat:end',
  CHAT_ENDED: 'chat:ended',

  ERROR: 'error'
} as const;
