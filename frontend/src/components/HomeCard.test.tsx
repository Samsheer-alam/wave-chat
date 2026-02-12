import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HomeCard } from './HomeCard';

describe('HomeCard', () => {
  const userId = 'user1';
  let partnerId = '';
  let setPartnerId: any;
  let onStartChat: any;

  beforeEach(() => {
    setPartnerId = vi.fn((value: string) => {
      partnerId = value;
    });
    onStartChat = vi.fn();

    render(
      <HomeCard
        userId={userId}
        partnerId={partnerId}
        setPartnerId={setPartnerId}
        onStartChat={onStartChat}
      />
    );
  });

  it('renders user ID and input/button', () => {
    expect(screen.getByText(`Your ID: ${userId}`)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter partner ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start Chat' })).toBeInTheDocument();
  });

  it('calls setPartnerId when input value changes', async () => {
    const input = screen.getByPlaceholderText('Enter partner ID');
    await userEvent.type(input, 'partner123');

    expect(setPartnerId).toHaveBeenCalled();
  });

  it('calls onStartChat when button is clicked', async () => {
    const button = screen.getByRole('button', { name: 'Start Chat' });
    await userEvent.click(button);

    expect(onStartChat).toHaveBeenCalledTimes(1);
  });
});
