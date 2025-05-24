'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useTimer } from '../providers/TimerProvider';
import { Play, Pause, RotateCcw, AlertCircle } from 'lucide-react';

const TimerControls: React.FC = () => {
  const { timerState, startTimer, pauseTimer, resetTimer, currentTask } = useTimer();
  
  // 检查任务是否为空
  const isTaskEmpty = !currentTask || currentTask.trim() === '';
  const canStart = !isTaskEmpty && (timerState === 'idle' || timerState === 'paused');

  return (
    <div className="mb-6">
      <div className="flex justify-center gap-4">
        {timerState === 'running' ? (
        <Button 
          onClick={pauseTimer}
          className="bg-amber-500 hover:bg-amber-600 text-white"
          size="lg"
        >
          <Pause className="w-5 h-5 mr-2" />
          暂停
        </Button>
        ) : (
          <Button 
            onClick={startTimer}
            className="bg-[#07C160] hover:bg-[#06a050] text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            size="lg"
            disabled={isTaskEmpty}
          >
            <Play className="w-5 h-5 mr-2" />
            {timerState === 'idle' ? '开始' : 
             timerState === 'paused' ? '继续' : 
             timerState === 'completed' ? '重新开始' : '开始'}
          </Button>
      )}
      
      <Button 
        onClick={resetTimer}
        variant="outline"
        size="lg"
        className="border-gray-300"
        disabled={timerState === 'idle'}
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        重置
      </Button>
      </div>
      
      {isTaskEmpty && (timerState === 'idle' || timerState === 'paused' || timerState === 'completed') && (
        <div className="flex items-center justify-center mt-3 text-sm text-amber-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          请先输入工作内容才能开始计时
        </div>
      )}
    </div>
  );
};

export default TimerControls;