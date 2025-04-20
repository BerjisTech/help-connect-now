
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import VideoCall from './video-call/VideoCall';
import { MessageData } from './types';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ChatHeader from './chat/ChatHeader';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';

interface ChatInterfaceProps {
  showVideoCall: boolean;
  interactionId: string;
  participantId?: string;
  joinAs: 'consultant' | 'user';
  messages: MessageData[];
  helperId?: string;
  onEndVideoCall: () => void;
  onSendMessage: (message: string) => Promise<void>;
  startVideoCall: (role: 'consultant' | 'user') => void;
}

const ChatInterface = ({
  showVideoCall,
  interactionId,
  participantId,
  joinAs,
  messages,
  helperId,
  onEndVideoCall,
  onSendMessage,
  startVideoCall,
}: ChatInterfaceProps) => {
  const [hasIncomingCall, setHasIncomingCall] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(showVideoCall ? "video" : "chat");

  // Listen for call notifications
  useEffect(() => {
    if (!interactionId) return;
    
    const channelName = `videocall:${interactionId}`;
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false }
      }
    });

    channel
      .on('broadcast', { event: 'call-notification' }, ({ payload }) => {
        console.log('Received call notification:', payload);
        if (payload.interactionId === interactionId) {
          // Only show notification to the consultant (recipient), not the initiator
          if (joinAs === 'consultant') {
            setHasIncomingCall(true);
            toast('Incoming video call', {
              description: 'Someone is trying to reach you via video call',
              action: {
                label: 'Join',
                onClick: () => startVideoCall(joinAs)
              },
              duration: 10000,
            });
          }
        }
      })
      .on('broadcast', { event: 'call-rejected' }, () => {
        setHasIncomingCall(false);
      })
      .on('broadcast', { event: 'call-accepted' }, () => {
        setHasIncomingCall(false);
      })
      .subscribe((status) => {
        console.log(`Call notification subscription status: ${status}`);
      });

    return () => {
      channel.unsubscribe();
    };
  }, [interactionId, joinAs, startVideoCall]);

  // Update active tab when showVideoCall changes
  useEffect(() => {
    if (showVideoCall && activeTab !== "video") {
      setActiveTab("video");
    }
  }, [showVideoCall]);

  const handleJoinCall = () => {
    startVideoCall(joinAs);
    setActiveTab("video");
  };

  return (
    <Card className="h-full flex flex-col dark:bg-indigo-950 dark:text-accent">
      <CardHeader className="pb-0">
        <ChatHeader 
          showVideoCall={showVideoCall}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasIncomingCall={hasIncomingCall}
          onJoinCall={handleJoinCall}
        />
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        {showVideoCall ? (
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="video" className="h-[400px] mt-0">
              <VideoCall
                interactionId={interactionId}
                participantId={participantId}
                isInitiator={joinAs === 'user'}
                onEndCall={onEndVideoCall}
                joinAs={joinAs}
              />
            </TabsContent>
            <TabsContent value="chat" className="h-[400px] overflow-y-auto mt-0">
              <MessageList messages={messages} helperId={helperId} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <MessageList messages={messages} helperId={helperId} />
          </div>
        )}
      </CardContent>
      
      {(!showVideoCall || activeTab === "chat") && (
        <CardFooter className="pt-2">
          <ChatInput onSendMessage={onSendMessage} />
        </CardFooter>
      )}
    </Card>
  );
};

export default ChatInterface;
