
import { useState, useEffect } from 'react';
import { Loader2, PhoneCall } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import VideoCall from './video-call/VideoCall';
import { MessageData } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
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
          setHasIncomingCall(true);
          if (joinAs === 'consultant') {
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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setSendingMessage(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } finally {
      setSendingMessage(false);
    }
  };

  const renderChatContent = () => (
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender_id === helperId ? 'justify-start' : 'justify-end'}`}
            >
              <div 
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.is_system_message ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100' :
                  message.sender_id === helperId 
                    ? 'bg-secondary text-secondary-foreground' 
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <p>{message.content}</p>
                <span className="text-xs opacity-70">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Card className="h-full flex flex-col dark:bg-indigo-950 dark:text-accent">
      <CardHeader className="pb-0">
        {showVideoCall ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="video">Video Call</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>
              
              {activeTab === "chat" && hasIncomingCall && (
                <Button 
                  size="sm" 
                  onClick={() => {
                    startVideoCall(joinAs);
                    setActiveTab("video");
                  }}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 animate-pulse"
                >
                  <PhoneCall className="h-4 w-4" />
                  Join Incoming Call
                </Button>
              )}
            </div>
          </Tabs>
        ) : (
          <CardTitle className="flex items-center justify-between">
            Chat
            {hasIncomingCall && (
              <Button 
                size="sm" 
                onClick={() => startVideoCall(joinAs)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 animate-pulse"
              >
                <PhoneCall className="h-4 w-4" />
                Join Incoming Call
              </Button>
            )}
          </CardTitle>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        {showVideoCall ? (
          <Tabs value={activeTab} className="hidden">
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
              {renderChatContent()}
            </TabsContent>
          </Tabs>
        ) : (
          renderChatContent()
        )}
        
        {/* Show or hide content based on active tab */}
        {showVideoCall && activeTab === "video" && (
          <div className="h-[400px]">
            <VideoCall
              interactionId={interactionId}
              participantId={participantId}
              isInitiator={joinAs === 'user'}
              onEndCall={onEndVideoCall}
              joinAs={joinAs}
            />
          </div>
        )}
        
        {showVideoCall && activeTab === "chat" && (
          <div className="h-[400px] overflow-y-auto">
            {renderChatContent()}
          </div>
        )}
      </CardContent>
      
      {(!showVideoCall || activeTab === "chat") && (
        <CardFooter className="pt-2">
          <div className="flex w-full gap-2">
            <Textarea 
              placeholder="Type your message here..." 
              className="flex-1 dark:bg-indigo-950 dark:text-accent"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              className="self-end" 
              onClick={handleSendMessage}
              disabled={sendingMessage || !newMessage.trim()}
            >
              {sendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ChatInterface;
