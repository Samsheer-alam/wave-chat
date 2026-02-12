import { CloseCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React from 'react';
import { IncomingRequestStatus } from '../types/chat.types';

interface Props {
  isOpen: boolean;
  fromUserId: string | null;
  status: IncomingRequestStatus;
  onAccept: () => void;
  onDecline: () => void;
}

export const ChatRequestModal: React.FC<Props> = ({
  isOpen,
  fromUserId,
  status,
  onAccept,
  onDecline
}) => {
  const isCancelled = status === 'cancelled';
  console.log('Rendering ChatRequestModal with status:', status, 'isCancelled:', isCancelled);
  return (
    <Modal
      open={isOpen}
      title={isCancelled ? 'Request Cancelled' : 'Incoming Chat Request'}
      centered
      okText="Accept"
      cancelText="Decline"
      onOk={onAccept}
      onCancel={onDecline}
      okButtonProps={{
        style: isCancelled ? { display: 'none' } : {}
      }}
      cancelButtonProps={{
        children: isCancelled ? 'OK' : 'Decline'
      }}
    >
      {isCancelled ? (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <CloseCircleOutlined style={{ fontSize: 48, color: '#ff4d4f', marginBottom: 16 }} />
          <p>
            <strong>{fromUserId}</strong> cancelled their chat request.
          </p>
        </div>
      ) : (
        <p>{fromUserId} wants to chat with you.</p>
      )}
    </Modal>
  );
};
