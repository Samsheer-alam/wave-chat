import { LogoutOutlined } from '@ant-design/icons';
import { Button, Grid, Layout, Typography } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChatEndedModal } from '../../components/ChatEndedModal';
import { MessageInput } from '../../components/MessageInput';
import { MessageList } from '../../components/MessageList';
import { useChatSocket } from '../../hooks/useChatSocket';
import { ChatLocationState } from '../../types/chat.types';

export const Chat: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const state = location.state as ChatLocationState;
  if (!state) {
    navigate('/', { replace: true });
    return null;
  }
  const { userId, partnerId, chatId } = state;

  const { messages, chatEndedInfo, sendMessage, endChat, handleChatEndModal } = useChatSocket(
    chatId,
    userId,
    partnerId
  );

  return (
    <div
      style={{
        ...containerStyle,
        maxWidth: isMobile ? '100%' : 900,
        boxShadow: isMobile ? 'none' : '0 0 10px rgba(0,0,0,0.15)'
      }}
    >
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <Typography.Title level={5} style={headerTitleStyle}>
            Chat with {partnerId}
          </Typography.Title>
          <Button
            type="text"
            aria-label="leave chat"
            shape="circle"
            icon={<LogoutOutlined />}
            onClick={endChat}
            style={cancelButtonStyle}
          />
        </Header>
        <Content style={contentStyle}>
          <MessageList messages={messages} userId={userId} partnerId={partnerId} />
        </Content>
        <Footer style={footerStyle}>{<MessageInput onSend={sendMessage} />}</Footer>
      </Layout>
      <ChatEndedModal
        isOpen={!!chatEndedInfo}
        endedBy={chatEndedInfo?.endedBy || null}
        onOk={handleChatEndModal}
      />
    </div>
  );
};

const containerStyle: CSSProperties = {
  width: '100%',
  margin: '0 auto',
  height: '100%',
  display: 'flex' as const,
  flexDirection: 'column' as const
};
const layoutStyle: CSSProperties = { height: '100vh', background: '#fff' };

const headerStyle: CSSProperties = {
  background: '#22cab6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px'
};

const contentStyle: CSSProperties = {
  flex: 1,
  overflow: 'hidden',
  background: '#fff'
};

const footerStyle: CSSProperties = {
  padding: 12,
  background: '#fff'
};

const cancelButtonStyle: CSSProperties = {
  backgroundColor: '#ea0c0ce3',
  color: '#fff',
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const headerTitleStyle: CSSProperties = {
  color: '#fff',
  margin: 0
};

export default Chat;
