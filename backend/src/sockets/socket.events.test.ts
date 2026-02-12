import { Server, Socket } from 'socket.io';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as handlers from './handlers';
import { registerSocketEvents } from './socket.events';

describe('registerSocketEvents', () => {
  let io: Partial<Server>;
  let socket: Partial<Socket>;

  beforeEach(() => {
    // Mock io and socket objects
    io = {} as Partial<Server>;
    socket = {} as Partial<Socket>;

    // Reset all spies/mocks
    vi.restoreAllMocks();
  });

  it('should call all handlers with correct arguments', () => {
    // Spy on all handlers
    const registerHandlerSpy = vi
      .spyOn(handlers, 'registerHandler')
      .mockImplementation(() => {});
    const chatRequestHandlerSpy = vi
      .spyOn(handlers, 'chatRequestHandler')
      .mockImplementation(() => {});
    const chatAcceptHandlerSpy = vi
      .spyOn(handlers, 'chatAcceptHandler')
      .mockImplementation(() => {});
    const chatRequestCancelledHandlerSpy = vi
      .spyOn(handlers, 'chatRequestCancelledHandler')
      .mockImplementation(() => {});
    const chatDeclineHandlerSpy = vi
      .spyOn(handlers, 'chatDeclineHandler')
      .mockImplementation(() => {});
    const messageSendHandlerSpy = vi
      .spyOn(handlers, 'messageSendHandler')
      .mockImplementation(() => {});
    const chatEndHandlerSpy = vi
      .spyOn(handlers, 'chatEndHandler')
      .mockImplementation(() => {});

    // Call the function under test
    registerSocketEvents(io as Server, socket as Socket);

    // Assert all handlers were called with correct args
    expect(registerHandlerSpy).toHaveBeenCalledWith(socket);
    expect(chatRequestHandlerSpy).toHaveBeenCalledWith(io, socket);
    expect(chatAcceptHandlerSpy).toHaveBeenCalledWith(io, socket);
    expect(chatRequestCancelledHandlerSpy).toHaveBeenCalledWith(io, socket);
    expect(chatDeclineHandlerSpy).toHaveBeenCalledWith(io, socket);
    expect(messageSendHandlerSpy).toHaveBeenCalledWith(io, socket);
    expect(chatEndHandlerSpy).toHaveBeenCalledWith(io, socket);
  });
});
