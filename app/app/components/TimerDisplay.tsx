'use client';

import React from 'react';
import { useTimer } from '../../providers/TimerProvider';
import { cn } from '@/lib/utils';
import { Play, Pause, CheckCircle, Clock } from 'lucide-react';

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
  const progress = timerDuration > 0 ? ((timerDuration - remainingTime) / timerDuration) * 100 : 0;
  const circumference = 2 * Math.PI * 140; // 增大半径到 140
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // 根据时间长度确定字体大小
  const isLongFormat = remainingTime >= 3600 || timerDuration >= 3600;
  const timerFontSize = isLongFormat ? "text-4xl lg:text-5xl" : "text-6xl lg:text-7xl";
  const durationFontSize = isLongFormat ? "text-base" : "text-lg";
  
  // Get status config
  const getStatusConfig = () => {
    switch (timerState) {
      case 'running':
        return {
          icon: <Play className="w-8 h-8" />,
          text: 'Focusing...',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          progressColor: 'stroke-green-500'
        };
      case 'paused':
        return {
          icon: <Pause className="w-8 h-8" />,
          text: 'Paused',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          progressColor: 'stroke-amber-500'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-8 h-8" />,
          text: 'Work Complete! Time for a break',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          progressColor: 'stroke-blue-500'
        };
      default:
        return {
          icon: <Clock className="w-8 h-8" />,
          text: timerDuration > 0 ? 'Ready to Start Working' : 'Set timer duration to begin',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          progressColor: 'stroke-gray-400'
        };
    }
  };

  const statusConfig = getStatusConfig();
  
  return (
    <div className="text-center relative">
      {/* Circular Progress */}
      <div className="relative inline-flex items-center justify-center mb-8">
        <svg
          className="transform -rotate-90 w-80 h-80" // 增大到 320x320px
          viewBox="0 0 320 320"
        >
          {/* Background circle */}
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className={cn("transition-all duration-1000", statusConfig.progressColor)}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        
        {/* Timer content in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          {/* Timer display */}
          <div className={cn(
            "font-bold tabular-nums tracking-tight text-gray-800 mb-2 leading-none",
            timerFontSize
          )}>
            {formatTime(remainingTime)}
          </div>
          
          {/* Duration display */}
          {timerDuration > 0 && (
            <div className={cn(
              "text-gray-500 font-medium leading-none",
              durationFontSize
            )}>
              / {formatTime(timerDuration)}
            </div>
          )}
        </div>
      </div>
      
      {/* Status Badge */}
      <div className={cn(
        "inline-flex items-center px-6 py-3 rounded-2xl border-2 transition-all duration-300",
        statusConfig.bgColor,
        statusConfig.borderColor
      )}>
        <div className={cn("mr-3", statusConfig.color)}>
          {statusConfig.icon}
        </div>
        <span className={cn("text-lg font-semibold", statusConfig.color)}>
          {statusConfig.text}
        </span>
      </div>
      
      {/* Progress Bar (Alternative visual) */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              timerState === 'running' ? "bg-green-500" : 
              timerState === 'paused' ? "bg-amber-500" : 
              timerState === 'completed' ? "bg-blue-500" : "bg-gray-400"
            )} 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay; 