'use client';

import React, { useEffect, useState } from 'react';
import { useTimer } from '../../providers/TimerProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Coffee, Volume2, VolumeX } from 'lucide-react';

const RestSuggestions: React.FC = () => {
  const { 
    timerState, 
    restSuggestions, 
    isLoadingSuggestions,
    voiceReminderEnabled,
    playRestSuggestions,
    stopRestSuggestions,
    isPlayingSuggestions
  } = useTimer();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (timerState === 'completed') {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [timerState]);

  if (!show) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center text-lg font-medium text-blue-700">
          <Coffee className="w-5 h-5 mr-2 text-blue-600" />
          Break Suggestions
        </h2>
        
        {voiceReminderEnabled && restSuggestions.length > 0 && !isLoadingSuggestions && (
          <div className="flex items-center space-x-2">
            {!isPlayingSuggestions ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => playRestSuggestions()}
                className="text-xs px-3 py-1 h-8 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
              >
                <Volume2 className="w-3 h-3 mr-1" />
                Play Suggestions
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={stopRestSuggestions}
                className="text-xs px-3 py-1 h-8 border-red-400 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <VolumeX className="w-3 h-3 mr-1" />
                Stop Playing
              </Button>
            )}
          </div>
        )}
      </div>
      
      {isLoadingSuggestions ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full bg-blue-100" />
          <Skeleton className="h-20 w-full bg-blue-100" />
          <Skeleton className="h-20 w-full bg-blue-100" />
        </div>
      ) : (
        <div className="space-y-3">
          {restSuggestions.map((suggestion, index) => (
            <Card 
              key={index} 
              className={`p-4 transition-colors ${
                isPlayingSuggestions 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'hover:bg-blue-50 border-blue-100'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-sm">
                  {index + 1}
                </div>
                <p className="text-blue-900">{suggestion}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {voiceReminderEnabled && restSuggestions.length > 0 && !isLoadingSuggestions && (
        <p className="text-xs text-blue-600 mt-3 text-center">
          {isPlayingSuggestions ? "Playing break suggestions for you..." : "Click \"Play Suggestions\" to hear the voice version"}
        </p>
      )}
    </div>
  );
};

export default RestSuggestions; 