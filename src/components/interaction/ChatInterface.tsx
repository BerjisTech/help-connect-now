
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import VideoCall from './VideoCall';
import { MessageData } from './types';

interface ChatInterfaceProps {
  showVideoCall: boolean;
  interactionId: string;
  participantId?: string;
  joinAs: 'consultant' | 'user';
  messages: MessageData[];
  helperId?: string;
  onEndVideoCall: () => void;
  onSendMessage: (message: string) => Promise<void>;
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
}: ChatInterfaceProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

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

  return (
    <Card className="h-full flex flex-col dark:bg-indigo-950 dark:text-accent">
      <CardHeader>
        <CardTitle>
          {showVideoCall ? 'Video Call' : 'Chat'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {showVideoCall ? (
          <div className="h-[400px]">
            <VideoCall
              interactionId={interactionId}
              participantId={participantId}
              isInitiator={joinAs === 'user'}
              onEndCall={onEndVideoCall}
              joinAs={joinAs}
            />
          </div>
        ) : messages.length === 0 ? (
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
      </CardContent>
      
      {!showVideoCall && (
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
