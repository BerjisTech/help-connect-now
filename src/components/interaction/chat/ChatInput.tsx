
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setSendingMessage(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
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
  );
};

export default ChatInput;
