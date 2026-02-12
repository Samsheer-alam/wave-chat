import { Button, Input, Typography } from 'antd';

interface Props {
  userId: string;
  partnerId: string;
  setPartnerId: (value: string) => void;
  onStartChat: () => void;
}

export const HomeCard: React.FC<Props> = ({
  userId,
  partnerId,
  setPartnerId,
  onStartChat
}) => {
  return (
    <div style={{ padding: 30, maxWidth: 400, margin: '0 auto' }}>
      <Typography.Title level={3}>Your ID: {userId}</Typography.Title>

      <Input
        placeholder="Enter partner ID"
        value={partnerId}
        onChange={(e) => setPartnerId(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <Button type="primary" block onClick={onStartChat}>
        Start Chat
      </Button>
    </div>
  );
};
