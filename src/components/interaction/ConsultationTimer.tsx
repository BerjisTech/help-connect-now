
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
  const startTimeRef = useRef<string | null>(startTime || null);
  
  // Initialize timer when startTime is first provided
  useEffect(() => {
    if (startTime && startTime !== startTimeRef.current) {
      startTimeRef.current = startTime;
      const startTimeMs = new Date(startTime).getTime();
      const now = Date.now();
      const initialElapsed = Math.floor((now - startTimeMs) / 1000);
      
      console.log('Timer initialized with:', {
        startTime,
        now: new Date(now).toISOString(),
        initialElapsed,
      });
      
      setElapsedTime(initialElapsed > 0 ? initialElapsed : 0);
    }
  }, [startTime]);
  
  // Handle the timer interval
  useEffect(() => {
    // Always clear the existing interval first
    if (intervalRef.current) {
      console.log('Clearing previous timer interval:', intervalRef.current);
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    
    if (isRunning && startTimeRef.current) {
      console.log('Starting timer, isRunning =', isRunning);
      
      // Create a new interval with a captured reference to the current elapsed time
      const currentTime = elapsedTime;
      const startTs = Date.now() - (currentTime * 1000);
      
      intervalRef.current = window.setInterval(() => {
        const newElapsed = Math.floor((Date.now() - startTs) / 1000);
        setElapsedTime(newElapsed);
      }, 1000);
      
      console.log('Timer started with interval ID:', intervalRef.current);
    } else {
      console.log('Timer stopped, isRunning =', isRunning);
    }
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        console.log('Cleaning up timer interval on effect cleanup:', intervalRef.current);
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [isRunning, startTimeRef.current]); // Only recreate interval when isRunning changes
  
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
      <span data-testid="timer-value">{formatTime(elapsedTime)}</span>
    </div>
  );
};

export default ConsultationTimer;
