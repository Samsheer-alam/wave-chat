import { Avatar, Typography } from 'antd';
import React from 'react';
import { Message } from '../types/chat.types';

interface Props {
  messages: Message[];
  userId: string;
  partnerId: string;
}

export const MessageList: React.FC<Props> = ({ messages, userId }) => {
  const getInitials = (id: string) => id.slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        height: 420,
        overflowY: 'auto',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16
      }}
    >
      {messages.map((msg, index) => {
        const isMe = msg.fromUserId === userId;

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: isMe ? 'flex-end' : 'flex-start',
              marginBottom: 12
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: isMe ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 8
              }}
            >
              <Avatar
                style={{
                  backgroundColor: isMe ? '#1677ff' : '#87d068'
                }}
              >
                {getInitials(msg.fromUserId)}
              </Avatar>

              <div
                style={{
                  background: isMe ? '#1677ff' : '#87d068',
                  color: '#ffffff',
                  padding: '10px 14px',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  maxWidth: 300,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                <Typography.Text style={{ color: 'inherit' }}>{msg.message}</Typography.Text>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
