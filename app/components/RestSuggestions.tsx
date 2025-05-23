'use client';

import React, { useEffect, useState } from 'react';
import { useTimer } from '../providers/TimerProvider';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Coffee } from 'lucide-react';

const RestSuggestions: React.FC = () => {
  const { timerState, restSuggestions, isLoadingSuggestions } = useTimer();
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
      <h2 className="flex items-center text-lg font-medium mb-3">
        <Coffee className="w-5 h-5 mr-2 text-[#07C160]" />
        休息建议
      </h2>
      
      {isLoadingSuggestions ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <div className="space-y-3">
          {restSuggestions.map((suggestion, index) => (
            <Card key={index} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-[#07C160] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  {index + 1}
                </div>
                <p>{suggestion}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestSuggestions;