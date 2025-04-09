
import { MessageData } from '../types';

interface MessageListProps {
  messages: MessageData[];
  helperId?: string;
}

const MessageList = ({ messages, helperId }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
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
  );
};

export default MessageList;
