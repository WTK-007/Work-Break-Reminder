'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API_CONFIG from '@/config/api-keys';

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
      const response = await fetch(API_CONFIG.OPENROUTER_BASE_URL + "/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_CONFIG.OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Work Rest Reminder",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-chat-v3-0324",
          "messages": [
            {
              "role": "system",
              "content": "你是一个有用的助手，专门建议5-10分钟的短暂休息活动。请保持建议简洁、实用且能让人感到放松。请用中文回答。请按照以下格式提供3个建议：\n1. [第一个建议]\n2. [第二个建议]\n3. [第三个建议]"
            },
            {
              "role": "user",
              "content": `我刚刚完成了"${currentTask}"的工作，专注了${Math.floor(timerDuration / 60)}分钟。请为我推荐3个可以在5-10分钟内完成的快速休息活动，帮助我放松和恢复精力。每个建议控制在1-2句话以内。`
            }
          ]
        })
      });

      const data = await response.json();
      let suggestions = data.choices[0].message.content
        .split(/\d+\.\s*/)
        .filter(Boolean)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
      
      // 确保必须有3个建议，不足的用默认建议补充
      const defaultSuggestions = [
        "起身在房间或办公室里简单走动一下，活动活动身体。",
        "做一些简单的伸展运动，放松颈部、肩膀和背部肌肉。",
        "让眼睛休息一下，看向20英尺外的地方20秒钟，缓解眼部疲劳。"
      ];
      
      // 如果生成的建议不足3个，用默认建议补充
      while (suggestions.length < 3) {
        const missingIndex = suggestions.length;
        if (missingIndex < defaultSuggestions.length) {
          suggestions.push(defaultSuggestions[missingIndex]);
        } else {
          suggestions.push(`额外的休息建议 ${missingIndex + 1}`);
        }
      }
      
      // 确保只有3个建议
      suggestions = suggestions.slice(0, 3);
      
      setRestSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching rest suggestions:", error);
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