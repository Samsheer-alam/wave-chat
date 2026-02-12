import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { message } from 'antd';
import { beforeEach, describe, expect, it } from 'vitest';
import Home from './Home';

// mock generateId
vi.mock('../../utils/id-generator', () => ({
  generateId: () => 'test-user'
}));

// mock antd message
vi.mock('antd', async () => {
  const actual = await vi.importActual<any>('antd');
  return {
    ...actual,
    message: {
      error: vi.fn()
    }
  };
});

// mock useHomeSocket
const mockRequestChat = vi.fn();
interface mockHookReturnType {
  incomingRequest: null | string;
  incomingRequestStatus: string;
  connectingTo: null | string;
  connectionStatus: string;
  requestChat: Function;
  acceptChatRequest: Function;
  declineChatRequest: Function;
  cancelConnection: Function;
}

const mockHookReturn: mockHookReturnType = {
  incomingRequest: null,
  incomingRequestStatus: 'pending',
  connectingTo: null,
  connectionStatus: 'connecting',
  requestChat: mockRequestChat,
  acceptChatRequest: vi.fn(),
  declineChatRequest: vi.fn(),
  cancelConnection: vi.fn()
};

vi.mock('../../hooks/useHomeSocket', () => ({
  useHomeSocket: () => mockHookReturn
}));

//Mock child components
vi.mock('../../components', async () => {
  const actual = await vi.importActual('../../components');

  return {
    ...actual,
    ChatRequestModal: ({ isOpen }: any) =>
      isOpen ? <div data-testid="chat-request-modal" /> : null,
    ConnectingModal: ({ isOpen }: any) => (isOpen ? <div data-testid="connecting-modal" /> : null)
  };
});

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockHookReturn.incomingRequest = null;
    mockHookReturn.connectingTo = null;
  });

  it('renders HomeCard with generated userId', () => {
    render(<Home />);
    expect(screen.getByText('Your ID: test-user')).toBeInTheDocument();
  });

  it('shows error if partnerId is empty', async () => {
    const user = userEvent.setup();

    render(<Home />);

    const button = screen.getByRole('button', { name: 'Start Chat' });
    await user.click(button);

    expect(message.error).toHaveBeenCalledWith('Enter partner ID');
    expect(mockRequestChat).not.toHaveBeenCalled();
  });

  it('calls requestChat when valid partnerId entered', async () => {
    const user = userEvent.setup();

    render(<Home />);

    const input = screen.getByPlaceholderText('Enter partner ID');
    const button = screen.getByRole('button', { name: 'Start Chat' });

    await user.type(input, 'partner123');
    await user.click(button);

    expect(mockRequestChat).toHaveBeenCalledWith('partner123');
  });

  it('renders ChatRequestModal when incomingRequest exists', () => {
    mockHookReturn.incomingRequest = 'connecting';

    render(<Home />);

    expect(screen.getByTestId('chat-request-modal')).toBeInTheDocument();
  });

  it('renders ConnectingModal when connectingTo exists', () => {
    mockHookReturn.connectingTo = 'partner999';

    render(<Home />);

    expect(screen.getByTestId('connecting-modal')).toBeInTheDocument();
  });
});
