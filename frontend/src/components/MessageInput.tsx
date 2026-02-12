import { SendOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import React, { useState } from 'react';

interface Props {
  onSend: (message: string) => void;
}

export const MessageInput: React.FC<Props> = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onPressEnter={handleSend}
      />
      <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
        Send
      </Button>
    </Space.Compact>
  );
};
