import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Chat from './Chat';

// mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn()
  };
});

// mock useChatSocket
const mockEndChat = vi.fn();

const mockSocketReturn = {
  messages: [],
  chatEndedInfo: null,
  sendMessage: vi.fn(),
  endChat: mockEndChat,
  handleChatEndModal: vi.fn()
};

vi.mock('../../hooks/useChatSocket', () => ({
  useChatSocket: () => mockSocketReturn
}));

// mock antd Grid breakpoint layout button
vi.mock('antd', async () => {
  const actual = await vi.importActual<any>('antd');

  return {
    ...actual,
    Grid: { useBreakpoint: () => ({ md: true }) },
    Layout: ({ children }: any) => <div data-testid="layout">{children}</div>,
    Typography: { Title: ({ children }: any) => <h5>{children}</h5> },
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  };
});
vi.mock('antd/es/layout/layout', () => ({
  Header: ({ children }: any) => <div data-testid="header">{children}</div>,
  Content: ({ children }: any) => <div data-testid="content">{children}</div>,
  Footer: ({ children }: any) => <div data-testid="footer">{children}</div>
}));
vi.mock('@ant-design/icons', async () => {
  const actual = await vi.importActual<any>('@ant-design/icons');
  return {
    ...actual,
    LogoutOutlined: () => <span data-testid="logout-icon" />,
    SendOutlined: () => <span data-testid="send-icon" />
  };
});
vi.mock('../../components/MessageList', () => ({
  MessageList: () => <div data-testid="message-list" />
}));
vi.mock('../../components/MessageInput', () => ({
  MessageInput: () => <div data-testid="message-input" />
}));
vi.mock('../../components/ChatEndedModal', () => ({
  ChatEndedModal: () => <div data-testid="chat-ended-modal" />
}));

describe('Chat Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to "/" if location state is missing', async () => {
    (useLocation as any).mockReturnValue({
      state: null
    });
    render(<Chat />);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('renders partner name in header', async () => {
    (useLocation as any).mockReturnValue({
      state: {
        userId: 'user1',
        partnerId: 'partner123',
        chatId: 'chat1'
      }
    });
    render(<Chat />);

    expect(screen.getByText('Chat with partner123')).toBeInTheDocument();
  });

  it('calls endChat when leave button is clicked', async () => {
    const user = userEvent.setup();

    (useLocation as any).mockReturnValue({
      state: {
        userId: 'user1',
        partnerId: 'partner123',
        chatId: 'chat1'
      }
    });
    render(<Chat />);

    const logoutButton = screen.getByRole('button', { name: 'leave chat' });

    await user.click(logoutButton);

    expect(mockEndChat).toHaveBeenCalled();
  });

  it('renders layout sections', async () => {
    const { useLocation } = await import('react-router-dom');

    (useLocation as any).mockReturnValue({
      state: {
        userId: 'user1',
        partnerId: 'partner123',
        chatId: 'chat1'
      }
    });

    render(<Chat />);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
