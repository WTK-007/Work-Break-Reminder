'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useTimer } from '../../providers/TimerProvider';
import { Play, Pause, RotateCcw, AlertCircle, Plus } from 'lucide-react';

const TimerControls: React.FC = () => {
  const { timerState, startTimer, pauseTimer, resetTimer, timerDuration, addTime } = useTimer();
  
  // Check if timer duration is set
  const isTimerNotSet = timerDuration <= 0;
  const canStart = !isTimerNotSet && (timerState === 'idle' || timerState === 'paused');

  return (
    <div className="space-y-6">
      {/* Main Control Buttons */}
      <div className="flex justify-center gap-6">
        {timerState === 'running' ? (
          <Button 
            onClick={pauseTimer}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-4 text-lg font-semibold rounded-2xl"
            size="lg"
          >
            <Pause className="w-6 h-6 mr-3" />
            Pause Focus
          </Button>
        ) : (
          <Button 
            onClick={startTimer}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-4 text-lg font-semibold rounded-2xl"
            size="lg"
            disabled={isTimerNotSet}
          >
            <Play className="w-6 h-6 mr-3" />
            {timerState === 'idle' ? 'Start Focus' : 
             timerState === 'paused' ? 'Resume Focus' : 
             timerState === 'completed' ? 'Start New Session' : 'Start Focus'}
          </Button>
        )}
        
        <Button 
          onClick={resetTimer}
          variant="outline"
          size="lg"
          className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-300 px-6 py-4 text-lg font-semibold rounded-2xl"
          disabled={timerState === 'idle'}
        >
          <RotateCcw className="w-5 h-5 mr-3" />
          Reset
        </Button>
      </div>
      
      {/* Warning Message */}
      {isTimerNotSet && (timerState === 'idle' || timerState === 'paused' || timerState === 'completed') && (
        <div className="flex items-center justify-center">
          <div className="flex items-center px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
            <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-blue-700 font-medium">Please set a timer duration before starting</span>
          </div>
        </div>
      )}
      
      {/* Quick Actions - Show when timer is running or when there's already time set */}
      {(timerState === 'running' || timerDuration > 0) && (
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Quick actions</p>
          <div className="flex justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addTime(5)}
              disabled={timerState === 'completed'}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg px-4 py-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-1" />
              +5 min
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addTime(10)}
              disabled={timerState === 'completed'}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg px-4 py-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-1" />
              +10 min
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Add extra time {timerState === 'running' ? 'while focusing' : 'to your session'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TimerControls; 