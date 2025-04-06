
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
  const intervalRef = useRef<number | null>(null);
  
  // Reset and initialize timer when startTime changes
  useEffect(() => {
    if (startTime) {
      const startTimeMs = new Date(startTime).getTime();
      const now = Date.now();
      const initialElapsed = Math.floor((now - startTimeMs) / 1000);
      
      console.log('Timer initialized with:', {
        startTime,
        now: new Date(now).toISOString(),
        initialElapsed,
      });
      
      setElapsedTime(initialElapsed > 0 ? initialElapsed : 0);
    } else {
      setElapsedTime(0);
    }
  }, [startTime]);
  
  // Handle timer interval
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (isRunning && startTime) {
      console.log('Starting timer interval, isRunning =', isRunning);
      
      // Set up a new interval
      intervalRef.current = window.setInterval(() => {
        const startTimeMs = new Date(startTime).getTime();
        const now = Date.now();
        const newElapsed = Math.floor((now - startTimeMs) / 1000);
        setElapsedTime(prev => {
          // Log if there are significant jumps in time
          if (Math.abs(newElapsed - prev) > 2) {
            console.log('Timer update:', { prev, newElapsed, diff: newElapsed - prev });
          }
          return newElapsed > 0 ? newElapsed : 0;
        });
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
        intervalRef.current = null;
      }
    };
  }, [isRunning, startTime]); // Depend on both isRunning and startTime
  
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
    <div className={cn("flex items-center gap-2 text-sm font-medium", className)} data-testid="consultation-timer">
      <Timer className="h-4 w-4" />
      <span data-testid="timer-value">{formatTime(elapsedTime)}</span>
    </div>
  );
};

export default ConsultationTimer;
