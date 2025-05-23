'use client';

import React from 'react';
import { useTimer } from '../providers/TimerProvider';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const TimerDisplay: React.FC = () => {
  const { remainingTime, timerDuration, timerState } = useTimer();
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = (remainingTime / timerDuration) * 100;
  
  return (
    <Card className="p-6 mb-6 relative overflow-hidden">
      <div className="text-center">
        <div className="text-5xl font-bold mb-2 tabular-nums tracking-tight">
          {formatTime(remainingTime)}
        </div>
        
        <div className="text-sm text-muted-foreground">
          {timerState === 'idle' && '准备开始工作'}
          {timerState === 'running' && '专注工作中...'}
          {timerState === 'paused' && '已暂停'}
          {timerState === 'completed' && '工作完成！休息一下吧'}
        </div>
      </div>
      
      <div className={cn(
        "mt-4 h-2 bg-gray-100 rounded-full overflow-hidden transition-all duration-300",
        timerState === 'completed' && "bg-gray-200"
      )}>
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            timerState === 'running' ? "bg-[#07C160]" : 
            timerState === 'paused' ? "bg-amber-400" : 
            timerState === 'completed' ? "bg-blue-400" : "bg-gray-300"
          )} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </Card>
  );
};

export default TimerDisplay;