'use client';

import React from 'react';
import { useTimer } from '../../providers/TimerProvider';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const TimerDisplay: React.FC = () => {
  const { remainingTime, timerDuration, timerState } = useTimer();
  
  // Format time as HH:MM:SS or MM:SS depending on duration
  const formatTime = (seconds: number): string => {
    if (seconds >= 3600) {
      // Show HH:MM:SS format for sessions over 1 hour
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      // Show MM:SS format for sessions under 1 hour
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Calculate progress percentage
  const progress = (remainingTime / timerDuration) * 100;
  
  return (
    <Card className="p-6 mb-6 relative overflow-hidden border border-blue-100 shadow-md">
      <div className="text-center">
        <div className="text-5xl font-bold mb-2 tabular-nums tracking-tight text-blue-700">
          {formatTime(remainingTime)}
        </div>
        
        <div className={cn(
          "text-sm transition-colors",
          timerState === 'idle' && 'text-blue-600',
          timerState === 'running' && 'text-blue-600',
          timerState === 'paused' && 'text-blue-500',
          timerState === 'completed' && 'text-blue-600 font-medium'
        )}>
          {timerState === 'idle' && 'Ready to Start Working'}
          {timerState === 'running' && 'Focusing...'}
          {timerState === 'paused' && 'Paused'}
          {timerState === 'completed' && 'Work Complete! Time for a break'}
        </div>
      </div>
      
      <div className={cn(
        "mt-4 h-2 bg-blue-100 rounded-full overflow-hidden transition-all duration-300",
        timerState === 'completed' && "bg-blue-100"
      )}>
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            timerState === 'running' ? "bg-blue-500" : 
            timerState === 'paused' ? "bg-blue-400" : 
            timerState === 'completed' ? "bg-blue-600" : "bg-blue-300"
          )} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </Card>
  );
};

export default TimerDisplay; 