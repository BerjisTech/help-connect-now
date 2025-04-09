
import { CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IncomingCallNotification from './IncomingCallNotification';

interface ChatHeaderProps {
  showVideoCall: boolean;
  activeTab: string;
  setActiveTab: (value: string) => void;
  hasIncomingCall: boolean;
  onJoinCall: () => void;
}

const ChatHeader = ({ 
  showVideoCall, 
  activeTab, 
  setActiveTab, 
  hasIncomingCall,
  onJoinCall
}: ChatHeaderProps) => {
  if (showVideoCall) {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="video">Video Call</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          
          {activeTab === "chat" && (
            <IncomingCallNotification 
              hasIncomingCall={hasIncomingCall} 
              onJoinCall={onJoinCall} 
            />
          )}
        </div>
      </Tabs>
    );
  }

  return (
    <CardTitle className="flex items-center justify-between">
      Chat
      <IncomingCallNotification 
        hasIncomingCall={hasIncomingCall} 
        onJoinCall={onJoinCall} 
      />
    </CardTitle>
  );
};

export default ChatHeader;
