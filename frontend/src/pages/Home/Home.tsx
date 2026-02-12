import { message } from 'antd';
import { useState } from 'react';
import { ChatRequestModal, ConnectingModal, HomeCard } from '../../components';
import { useHomeSocket } from '../../hooks/useHomeSocket';
import { generateId } from '../../utils/id-generator';

export const Home: React.FC = () => {
  const [userId] = useState<string>(generateId());
  const [partnerId, setPartnerId] = useState<string>('');

  const {
    incomingRequest,
    incomingRequestStatus,
    connectingTo,
    connectionStatus,
    requestChat,
    acceptChatRequest,
    declineChatRequest,
    cancelConnection
  } = useHomeSocket(userId);

  const handleStartChat = () => {
    if (!partnerId.trim()) {
      return message.error('Enter partner ID');
    }

    requestChat(partnerId);
  };

  return (
    <>
      <HomeCard
        userId={userId}
        partnerId={partnerId}
        setPartnerId={setPartnerId}
        onStartChat={handleStartChat}
      />
      <ChatRequestModal
        isOpen={!!incomingRequest}
        fromUserId={incomingRequest}
        status={incomingRequestStatus}
        onAccept={acceptChatRequest}
        onDecline={declineChatRequest}
      />
      <ConnectingModal
        isOpen={!!connectingTo}
        partnerId={connectingTo}
        status={connectionStatus}
        onCancel={cancelConnection}
      />
    </>
  );
};

export default Home;
