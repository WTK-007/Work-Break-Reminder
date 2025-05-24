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
  voiceReminderEnabled: boolean;
  setVoiceReminderEnabled: (enabled: boolean) => void;
  selectedVoice: string;
  setSelectedVoice: (voiceName: string) => void;
  availableVoices: SpeechSynthesisVoice[];
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
  const [voiceReminderEnabled, setVoiceReminderEnabled] = useState<boolean>(true);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isVoicesLoaded, setIsVoicesLoaded] = useState<boolean>(false);

  // Load saved preferences from localStorage on initial load
  useEffect(() => {
    const savedTask = localStorage.getItem('currentTask');
    const savedDuration = localStorage.getItem('timerDuration');
    const savedVoiceReminder = localStorage.getItem('voiceReminderEnabled');
    const savedVoice = localStorage.getItem('selectedVoice');

    if (savedTask) setCurrentTask(savedTask);
    if (savedDuration) {
      const duration = parseInt(savedDuration, 10);
      setTimerDuration(duration);
      setRemainingTime(duration);
    }
    if (savedVoiceReminder !== null) {
      setVoiceReminderEnabled(savedVoiceReminder === 'true');
    }
    if (savedVoice) {
      setSelectedVoice(savedVoice);
    }

    // 加载可用语音
    const initVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = speechSynthesis.getVoices();
        
        if (voices.length === 0) {
          return;
        }
        
        // 过滤中文语音 - 只保留特定的三个语音
        const chineseVoices = voices.filter(voice => {
          // 只保留瑶瑶（Microsoft Yaoyao）
          if (voice.name.includes('Microsoft Yaoyao')) return true;
          
          // 只保留特定的Google语音作为婷婷和小花
          if (voice.name.includes('Google')) {
            // 婷婷（普通话）- 中国大陆版本
            if (voice.name.includes('中国大陆') || voice.name.includes('Mainland') || voice.lang === 'zh-CN') return true;
            // 小花（粤语）- 香港版本  
            if (voice.name.includes('香港') || voice.name.includes('Hong Kong') || voice.lang === 'zh-HK') return true;
          }
          
          return false;
        });
        
        // 去重和优先级排序
        const uniqueVoices = [];
        const seenNames = new Set();
        
        // 优先级顺序：瑶瑶 > 婷婷 > 小花
        const priorityOrder = [
          'Microsoft Yaoyao',
          'Google', // 包含婷婷和小花
        ];
        
        // 按优先级添加语音
        for (const priority of priorityOrder) {
          for (const voice of chineseVoices) {
            if (voice.name.includes(priority) && !seenNames.has(voice.name)) {
              uniqueVoices.push(voice);
              seenNames.add(voice.name);
            }
          }
        }
        
        setAvailableVoices(uniqueVoices);
        setIsVoicesLoaded(true);
        console.log("初始化语音:", uniqueVoices.map(v => `${v.name} (${v.lang})`));
      }
    };

    // 立即尝试加载
    initVoices();
    
    // 添加事件监听器
    if ('speechSynthesis' in window && !isVoicesLoaded) {
      const handleVoicesChanged = () => {
        if (!isVoicesLoaded) {
          initVoices();
        }
      };
      
      speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []); // 空依赖数组，只在初始化时执行

  // Auto select default voice (only execute once on initial load)
  useEffect(() => {
    if (isVoicesLoaded && !selectedVoice && availableVoices.length > 0) {
      const femaleVoicePreferences = [
        'Microsoft Yaoyao - Chinese (Simplified, PRC)', // 瑶瑶（甜美女声）
        'Google 中文（中国大陆）', // 婷婷（普通话）
        'Google 中文（香港）' // 小花（粤语）
      ];
      
      let bestVoice = null;
      for (const preference of femaleVoicePreferences) {
        bestVoice = availableVoices.find(voice => 
          voice.name.includes(preference.split(' ')[0]) || 
          voice.name.includes(preference.split(' ')[1])
        );
        if (bestVoice) break;
      }
      
      // 如果没有找到偏好语音，选择第一个可用的
      if (!bestVoice && availableVoices.length > 0) {
        bestVoice = availableVoices[0];
      }
      
      if (bestVoice) {
        console.log("自动选择语音:", bestVoice.name);
        setSelectedVoice(bestVoice.name);
      }
    }
  }, [isVoicesLoaded, availableVoices, selectedVoice]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('currentTask', currentTask);
    localStorage.setItem('timerDuration', timerDuration.toString());
    localStorage.setItem('voiceReminderEnabled', voiceReminderEnabled.toString());
    localStorage.setItem('selectedVoice', selectedVoice);
  }, [currentTask, timerDuration, voiceReminderEnabled, selectedVoice]);

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
    // 播放提示音
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log("Audio play failed:", e));
    
    // 根据用户设置决定是否播放语音提醒
    if (voiceReminderEnabled) {
      // 延迟一点播放语音，让提示音先播放
      setTimeout(() => {
        playVoiceReminder();
      }, 500);
    }
  };

  const playVoiceReminder = () => {
    // 检查浏览器是否支持语音合成
    if ('speechSynthesis' in window) {
      try {
        // 创建温柔的语音提醒内容
        const reminderText = `工作时间结束了！你已经专注工作${Math.floor(timerDuration / 60)}分钟，现在该休息一下了吧！`;
        
        // 创建语音合成实例
        const utterance = new SpeechSynthesisUtterance(reminderText);
        
        // 使用用户选择的语音
        if (selectedVoice) {
          const voices = speechSynthesis.getVoices();
          const chosenVoice = voices.find(voice => voice.name === selectedVoice);
          if (chosenVoice) {
            utterance.voice = chosenVoice;
            console.log("使用选择的语音:", chosenVoice.name);
          }
        }
        
        // 设置温柔的语音参数
        utterance.lang = 'zh-CN';     // 中文语音
        utterance.rate = 0.8;         // 较慢的语速，更温柔
        utterance.pitch = 1.3;        // 稍高的音调，更甜美
        utterance.volume = 0.9;       // 适中的音量
        
        // 添加语音事件监听
        utterance.onstart = () => {
          console.log("温柔的语音提醒开始播放");
        };
        
        utterance.onend = () => {
          console.log("语音提醒播放完成");
        };
        
        utterance.onerror = (event) => {
          console.log("语音播放出错:", event.error);
        };
        
        // 播放语音提醒
        speechSynthesis.speak(utterance);
        
      } catch (error) {
        console.log("语音提醒播放失败:", error);
      }
    } else {
      console.log("浏览器不支持语音合成功能");
    }
  };

  const startTimer = useCallback(() => {
    // If restarting from completed state, need to reset remaining time
    if (timerState === 'completed') {
      setRemainingTime(timerDuration);
      setRestSuggestions([]); // Clear previous rest suggestions
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
    isLoadingSuggestions,
    voiceReminderEnabled,
    setVoiceReminderEnabled,
    selectedVoice,
    setSelectedVoice,
    availableVoices
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};