'use client';

import React from 'react';
import { useTimer } from '../providers/TimerProvider';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const TimerDisplay: React.FC = () => {
  const { remainingTime, timerDuration, timerState } = useTimer();
  
  // Format time as HH:MM:SS or MM:SS depending on duration
  const formatTime = (seconds: number): string => {
    if (seconds >= 3600) {
      // 超过1小时，显示HH:MM:SS格式
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      // 不到1小时，显示MM:SS格式
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Calculate progress percentage
  const progress = (remainingTime / timerDuration) * 100;
  
  return (
    <Card className="p-6 mb-6 relative overflow-hidden border border-amber-100 shadow-md">
      <div className="text-center">
        <div className="text-5xl font-bold mb-2 tabular-nums tracking-tight text-amber-700">
          {formatTime(remainingTime)}
        </div>
        
        <div className={cn(
          "text-sm transition-colors",
          timerState === 'idle' && 'text-amber-600',
          timerState === 'running' && 'text-amber-600',
          timerState === 'paused' && 'text-amber-500',
          timerState === 'completed' && 'text-amber-600 font-medium'
        )}>
          {timerState === 'idle' && '准备开始工作'}
          {timerState === 'running' && '专注工作中...'}
          {timerState === 'paused' && '已暂停'}
          {timerState === 'completed' && '工作完成！休息一下吧'}
        </div>
      </div>
      
      <div className={cn(
        "mt-4 h-2 bg-amber-100 rounded-full overflow-hidden transition-all duration-300",
        timerState === 'completed' && "bg-amber-100"
      )}>
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            timerState === 'running' ? "bg-amber-500" : 
            timerState === 'paused' ? "bg-amber-400" : 
            timerState === 'completed' ? "bg-amber-600" : "bg-amber-300"
          )} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </Card>
  );
};

export default TimerDisplay;