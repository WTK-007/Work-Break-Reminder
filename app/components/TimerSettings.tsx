'use client';

import React, { useState } from 'react';
import { useTimer } from '../providers/TimerProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';

const TimerSettings: React.FC = () => {
  const { 
    timerDuration, 
    setTimerDuration, 
    setRemainingTime, 
    timerState, 
    setTimerState,
    setRestSuggestions 
  } = useTimer();
  const [customMinutes, setCustomMinutes] = useState<string>(
    (timerDuration / 60).toString()
  );

  const presetTimes = [
    { label: '15分钟', minutes: 15 },
    { label: '30分钟', minutes: 30 },
    { label: '60分钟', minutes: 60 },
  ];

  const handlePresetSelect = (minutes: number) => {
    const seconds = minutes * 60;
    setTimerDuration(seconds);
    setRemainingTime(seconds);
    setCustomMinutes(minutes.toString());
    
    // 重置状态为idle并清空休息建议
    setTimerState('idle');
    setRestSuggestions([]);
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomMinutes(e.target.value);
  };

  const handleCustomTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(customMinutes, 10) || 1; // Default to 1 if invalid
    const clampedMinutes = Math.min(Math.max(minutes, 1), 120); // Clamp between 1-120
    const seconds = clampedMinutes * 60;
    
    setTimerDuration(seconds);
    setRemainingTime(seconds);
    setCustomMinutes(clampedMinutes.toString());
    
    // 重置状态为idle并清空休息建议
    setTimerState('idle');
    setRestSuggestions([]);
  };

  const isDisabled = timerState === 'running';

  return (
    <div className="mb-6">
      <Label className="block text-sm font-medium mb-3">
        <Clock className="w-4 h-4 inline-block mr-1" />
        工作时长设置
      </Label>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {presetTimes.map((preset) => (
          <Button
            key={preset.minutes}
            variant={timerDuration === preset.minutes * 60 ? "default" : "outline"}
            className={
              timerDuration === preset.minutes * 60 
                ? "bg-[#07C160] hover:bg-[#06a050] text-white" 
                : "border-gray-200"
            }
            onClick={() => handlePresetSelect(preset.minutes)}
            disabled={isDisabled}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      
      <form onSubmit={handleCustomTimeSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            type="number"
            min="1"
            max="120"
            value={customMinutes}
            onChange={handleCustomTimeChange}
            className="w-full"
            disabled={isDisabled}
            aria-label="自定义分钟数"
          />
        </div>
        <Button 
          type="submit"
          variant="outline"
          className="border-gray-200"
          disabled={isDisabled}
        >
          设置
        </Button>
      </form>
    </div>
  );
};

export default TimerSettings;