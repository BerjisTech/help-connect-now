
import { useState, useEffect, useRef } from 'react';
import { Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsultationTimerProps {
  isRunning: boolean;
  startTime?: string | null;
  className?: string;
}

const ConsultationTimer = ({ isRunning, startTime, className }: ConsultationTimerProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<number>();
  
  useEffect(() => {
    // Reset timer when startTime changes
    if (startTime) {
      const startTimeMs = new Date(startTime).getTime();
      const initialElapsed = Math.floor((Date.now() - startTimeMs) / 1000);
      setElapsedTime(initialElapsed > 0 ? initialElapsed : 0);
    } else {
      setElapsedTime(0);
    }
    
    // Clear any existing interval when startTime changes
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, [startTime]);
  
  useEffect(() => {
    // Clean up existing interval when isRunning changes
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    
    if (isRunning) {
      // Create a new interval
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      console.log('Timer started with interval ID:', intervalRef.current);
    } else {
      console.log('Timer stopped');
    }
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        console.log('Clearing timer interval on unmount:', intervalRef.current);
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [isRunning]);
  
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return [
      hours > 0 ? hours.toString().padStart(2, '0') : null,
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0')
    ]
      .filter(Boolean)
      .join(':');
  };
  
  return (
    <div className={cn("flex items-center gap-2 text-sm font-medium", className)}>
      <Timer className="h-4 w-4" />
      <span>{formatTime(elapsedTime)}</span>
    </div>
  );
};

export default ConsultationTimer;
