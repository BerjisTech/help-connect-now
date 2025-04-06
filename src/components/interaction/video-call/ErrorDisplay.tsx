
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ErrorDisplayProps } from './types';

const ErrorDisplay = ({ onRetryConnection, onTryAudioOnly, onEndCall }: ErrorDisplayProps) => {
  return (
    <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden flex flex-col items-center justify-center p-6 text-white space-y-6">
      <div className="bg-red-500/20 p-4 rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">Camera or Microphone Error</h3>
        <p className="text-sm mb-4">
          We couldn't access your camera or microphone. This could be due to:
        </p>
        <ul className="text-sm list-disc text-left pl-4 mb-4">
          <li>Another application is using your camera</li>
          <li>Your camera is disconnected or disabled</li>
          <li>You need to allow browser access in your system settings</li>
        </ul>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={onRetryConnection} 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Video Call
        </Button>
        
        <Button 
          onClick={onTryAudioOnly} 
          variant="outline"
        >
          Try Audio Only
        </Button>
        
        <Button 
          onClick={onEndCall} 
          variant="destructive"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
