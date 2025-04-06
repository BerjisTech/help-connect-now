
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg">Loading interaction data...</p>
      </div>
    </div>
  );
};

export default LoadingState;
