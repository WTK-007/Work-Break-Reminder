'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

interface TimerContextType {
  currentTask: string;
  setCurrentTask: (task: string) => void;
  timerDuration: number; // in seconds
  setTimerDuration: (duration: number) => void;
  remainingTime: number; // in seconds
  setRemainingTime: (time: number) => void;
  timerState: TimerState;
  setTimerState: (state: TimerState) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  restSuggestions: string[];
  setRestSuggestions: (suggestions: string[]) => void;
  isLoadingSuggestions: boolean;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTask, setCurrentTask] = useState<string>('');
  const [timerDuration, setTimerDuration] = useState<number>(25 * 60); // Default 25 minutes
  const [remainingTime, setRemainingTime] = useState<number>(25 * 60);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [restSuggestions, setRestSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);

  // Load saved preferences from localStorage on initial load
  useEffect(() => {
    const savedTask = localStorage.getItem('currentTask');
    const savedDuration = localStorage.getItem('timerDuration');

    if (savedTask) setCurrentTask(savedTask);
    if (savedDuration) {
      const duration = parseInt(savedDuration, 10);
      setTimerDuration(duration);
      setRemainingTime(duration);
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('currentTask', currentTask);
    localStorage.setItem('timerDuration', timerDuration.toString());
  }, [currentTask, timerDuration]);

  // Timer logic
  useEffect(() => {
    if (timerState === 'running') {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setTimerState('completed');
            fetchRestSuggestions();
            playNotificationSound();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      setTimerInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [timerState]);

  const fetchRestSuggestions = async () => {
    setIsLoadingSuggestions(true);
    setRestSuggestions([]); // 清空之前的建议
    
    try {
      const response = await fetch("/api/rest-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentTask,
          timerDuration
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setRestSuggestions(data.suggestions);
      
    } catch (error) {
      console.error("Error fetching rest suggestions:", error);
      // 使用默认建议作为后备
      setRestSuggestions([
        "起身在房间或办公室里简单走动一下，活动活动身体。",
        "做一些简单的伸展运动，放松颈部、肩膀和背部肌肉。",
        "让眼睛休息一下，看向20英尺外的地方20秒钟，缓解眼部疲劳。"
      ]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log("Audio play failed:", e));
  };

  const startTimer = useCallback(() => {
    // 如果是从completed状态重新开始，需要重置剩余时间
    if (timerState === 'completed') {
      setRemainingTime(timerDuration);
      setRestSuggestions([]); // 清空之前的休息建议
    }
    setTimerState('running');
  }, [timerState, timerDuration]);

  const pauseTimer = useCallback(() => {
    setTimerState('paused');
  }, []);

  const resetTimer = useCallback(() => {
    setRemainingTime(timerDuration);
    setTimerState('idle');
    setRestSuggestions([]);
  }, [timerDuration]);

  const value = {
    currentTask,
    setCurrentTask,
    timerDuration,
    setTimerDuration,
    remainingTime,
    setRemainingTime,
    timerState,
    setTimerState,
    startTimer,
    pauseTimer,
    resetTimer,
    restSuggestions,
    setRestSuggestions,
    isLoadingSuggestions
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};