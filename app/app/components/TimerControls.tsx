'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useTimer } from '../../providers/TimerProvider';
import { Play, Pause, RotateCcw, AlertCircle } from 'lucide-react';

const TimerControls: React.FC = () => {
  const { timerState, startTimer, pauseTimer, resetTimer, currentTask } = useTimer();
  
  // Check if task is empty
  const isTaskEmpty = !currentTask || currentTask.trim() === '';
  const canStart = !isTaskEmpty && (timerState === 'idle' || timerState === 'paused');

  return (
    <div className="mb-6">
      <div className="flex justify-center gap-4">
        {timerState === 'running' ? (
          <Button 
            onClick={pauseTimer}
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
            size="lg"
          >
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </Button>
        ) : (
          <Button 
            onClick={startTimer}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
            size="lg"
            disabled={isTaskEmpty}
          >
            <Play className="w-5 h-5 mr-2" />
            {timerState === 'idle' ? 'Start' : 
             timerState === 'paused' ? 'Resume' : 
             timerState === 'completed' ? 'Start Again' : 'Start'}
          </Button>
        )}
        
        <Button 
          onClick={resetTimer}
          variant="outline"
          size="lg"
          className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
          disabled={timerState === 'idle'}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>
      
      {isTaskEmpty && (timerState === 'idle' || timerState === 'paused' || timerState === 'completed') && (
        <div className="flex items-center justify-center mt-3 text-sm text-blue-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          Please enter a task before starting the timer
        </div>
      )}
    </div>
  );
};

export default TimerControls; 