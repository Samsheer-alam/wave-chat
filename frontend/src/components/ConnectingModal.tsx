import { CloseCircleOutlined } from '@ant-design/icons';
import { Modal, Spin } from 'antd';
import React from 'react';

interface Props {
  isOpen: boolean;
  partnerId: string | null;
  status: 'connecting' | 'declined';
  onCancel: () => void;
}

export const ConnectingModal: React.FC<Props> = ({
  isOpen,
  partnerId,
  status,
  onCancel
}) => {
  const isDeclined = status === 'declined';

  return (
    <Modal
      open={isOpen}
      title={isDeclined ? 'Request Declined' : 'Connecting...'}
      centered
      closable={false}
      okText={isDeclined ? 'OK' : 'Cancel'}
      okButtonProps={{ danger: !isDeclined }}
      onOk={onCancel}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        {isDeclined ? (
          <>
            <CloseCircleOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
            <p style={{ marginTop: 16, fontSize: 16 }}>
              <strong>{partnerId}</strong> declined your chat request.
            </p>
          </>
        ) : (
          <>
            <Spin size="large" />
            <p style={{ marginTop: 16, fontSize: 16 }}>
              Connecting to <strong>{partnerId}</strong>...
            </p>
            <p style={{ color: '#999', fontSize: 14 }}>Waiting for response</p>
          </>
        )}
      </div>
    </Modal>
  );
};
