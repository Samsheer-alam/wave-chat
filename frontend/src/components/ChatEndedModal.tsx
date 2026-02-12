import { Modal, Typography } from 'antd';
import React from 'react';

const { Title, Text } = Typography;

interface Props {
  isOpen: boolean;
  endedBy: string | null;
  onOk: () => void;
}

export const ChatEndedModal: React.FC<Props> = ({ isOpen, endedBy, onOk }) => {
  return (
    <Modal
      open={isOpen}
      centered
      closable={false}
      okText="Back to Home"
      onOk={onOk}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <div style={{ textAlign: 'center' }}>
        <Title level={4}>Chat Closed</Title>
        <Text>
          Chat has been closed by <strong>{endedBy}</strong>
        </Text>
      </div>
    </Modal>
  );
};
