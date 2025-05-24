'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

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
  autoPlaySuggestions: boolean;
  setAutoPlaySuggestions: (enabled: boolean) => void;
  selectedVoice: string;
  setSelectedVoice: (voiceName: string) => void;
  availableVoices: SpeechSynthesisVoice[];
  playRestSuggestions: (shouldCancel?: boolean) => void;
  stopRestSuggestions: () => void;
  isPlayingSuggestions: boolean;
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
  const [autoPlaySuggestions, setAutoPlaySuggestions] = useState<boolean>(true);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isVoicesLoaded, setIsVoicesLoaded] = useState<boolean>(false);
  const [isPlayingSuggestions, setIsPlayingSuggestions] = useState<boolean>(false);
  const [hasPlayedSuggestions, setHasPlayedSuggestions] = useState(false);
  const [voiceReminderCompleted, setVoiceReminderCompleted] = useState(false);
  const [hasPlayedNotificationSound, setHasPlayedNotificationSound] = useState(false);
  
  // 使用useRef来更可靠地防止重复播放
  const notificationSoundPlayedRef = useRef(false);
  const currentTimerSessionRef = useRef(0);

  // Load saved preferences from localStorage on initial load
  useEffect(() => {
    const savedTask = localStorage.getItem('currentTask');
    const savedDuration = localStorage.getItem('timerDuration');
    const savedVoiceReminder = localStorage.getItem('voiceReminderEnabled');
    const savedAutoPlay = localStorage.getItem('autoPlaySuggestions');
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
    if (savedAutoPlay !== null) {
      setAutoPlaySuggestions(savedAutoPlay === 'true');
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

  // 监听休息建议加载完成并自动播放
  useEffect(() => {
    // 检查是否需要自动播放休息建议
    if (autoPlaySuggestions && 
        voiceReminderCompleted &&
        restSuggestions.length > 0 && 
        !hasPlayedSuggestions &&
        timerState === 'completed' &&
        !isLoadingSuggestions) {
      
      console.log("条件满足，开始自动播放休息建议");
      setHasPlayedSuggestions(true);
      
      setTimeout(() => {
        playRestSuggestions(false); // false表示不要cancel现有语音
      }, 800); // 稍长的延迟让用户有个缓冲
    }
  }, [autoPlaySuggestions, voiceReminderCompleted, restSuggestions, hasPlayedSuggestions, timerState, isLoadingSuggestions]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('currentTask', currentTask);
    localStorage.setItem('timerDuration', timerDuration.toString());
    localStorage.setItem('voiceReminderEnabled', voiceReminderEnabled.toString());
    localStorage.setItem('autoPlaySuggestions', autoPlaySuggestions.toString());
    localStorage.setItem('selectedVoice', selectedVoice);
  }, [currentTask, timerDuration, voiceReminderEnabled, autoPlaySuggestions, selectedVoice]);

  // Timer logic
  useEffect(() => {
    if (timerState === 'running') {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setTimerState('completed');
            // 调用播放函数，让函数内部处理防重复
            console.log("计时完成，准备播放提示音");
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
    
    console.log(`开始获取休息建议，任务: "${currentTask}", 时长: ${Math.floor(timerDuration / 60)}分钟`);
    
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
      console.log("API返回的休息建议:", data.suggestions);
      setRestSuggestions(data.suggestions);
      
    } catch (error) {
      console.error("Error fetching rest suggestions:", error);
      // 使用多样化的随机默认建议作为后备
      const diverseDefaultSuggestions = [
        "尝试5分钟的深呼吸冥想，专注于呼吸节奏。",
        "播放一首喜欢的音乐，随着节拍轻松摆动身体。",
        "给朋友或家人发一条关心的消息。",
        "观察窗外的景色，寻找三个之前没注意到的细节。",
        "做一些简单的颈部和肩膀拉伸运动。",
        "喝一杯温水，慢慢品味每一口。",
        "整理一下工作桌面，让环境更整洁。",
        "练习几分钟正念，专注当下的感受。",
        "阅读几页轻松的文章或小故事。",
        "做几个简单的眼球运动练习。"
      ];
      
      // 随机选择3个不同的建议
      const randomSuggestions = diverseDefaultSuggestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      console.log("API调用失败，使用随机默认建议:", randomSuggestions);
      setRestSuggestions(randomSuggestions);
      
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const playNotificationSound = () => {
    console.log("playNotificationSound被调用，ref状态:", notificationSoundPlayedRef.current);
    
    // 检查是否已播放过
    if (notificationSoundPlayedRef.current) {
      console.log("提示音已播放过，跳过");
      return;
    }
    
    // 标记为已播放
    notificationSoundPlayedRef.current = true;
    console.log("设置ref为true，开始播放提示音");
    
    // 创建并播放提示音
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.8;
      
      audio.play()
        .then(() => {
          console.log("✅ 提示音播放成功");
        })
        .catch(e => {
          console.log("❌ 提示音播放失败:", e);
        });
        
    } catch (error) {
      console.log("❌ 创建音频对象失败:", error);
    }
    
    // 根据用户设置决定是否播放语音提醒
    if (voiceReminderEnabled) {
      setTimeout(() => {
        playVoiceReminder();
      }, 500);
    } else {
      setVoiceReminderCompleted(true);
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
          setVoiceReminderCompleted(true);
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
    // 重置所有状态
    setHasPlayedSuggestions(false);
    setVoiceReminderCompleted(false);
    setHasPlayedNotificationSound(false);
    
    // 使用ref重置，更可靠
    notificationSoundPlayedRef.current = false;
    currentTimerSessionRef.current += 1; // 增加会话ID
    
    console.log(`开始新的计时会话: ${currentTimerSessionRef.current}`);
    
    if (timerState === 'completed') {
      setRemainingTime(timerDuration);
      setRestSuggestions([]);
    }
    
    // 每次开始计时都重新获取休息建议，确保建议是最新的
    console.log("开始计时，提前获取休息建议");
    fetchRestSuggestions();
    
    setTimerState('running');
  }, [timerState, timerDuration]);

  const pauseTimer = useCallback(() => {
    setTimerState('paused');
  }, []);

  const resetTimer = useCallback(() => {
    setRemainingTime(timerDuration);
    setTimerState('idle');
    setRestSuggestions([]);
    setHasPlayedSuggestions(false);
    setVoiceReminderCompleted(false);
    setHasPlayedNotificationSound(false);
  }, [timerDuration]);

  const playRestSuggestions = (shouldCancel: boolean = true) => {
    if (restSuggestions.length === 0) {
      return;
    }

    if ('speechSynthesis' in window) {
      setIsPlayingSuggestions(true);
      
      // 根据参数决定是否停止当前播放的语音
      if (shouldCancel) {
        speechSynthesis.cancel();
      }
      
      try {
        // 准备播放的文本内容
        const introText = "为您推荐以下休息活动：";
        const suggestionTexts = restSuggestions.map((suggestion, index) => 
          `第${index + 1}个建议：${suggestion}`
        );
        const outroText = "选择一个你喜欢的活动，好好休息一下吧！";
        
        const allTexts = [introText, ...suggestionTexts, outroText];
        let currentIndex = 0;
        
        const playNext = () => {
          if (currentIndex >= allTexts.length) {
            setIsPlayingSuggestions(false);
            return;
          }
          
          const utterance = new SpeechSynthesisUtterance(allTexts[currentIndex]);
          
          // 使用用户选择的语音
          if (selectedVoice) {
            const voices = speechSynthesis.getVoices();
            const chosenVoice = voices.find(voice => voice.name === selectedVoice);
            if (chosenVoice) {
              utterance.voice = chosenVoice;
            }
          }
          
          // 设置温柔的语音参数
          utterance.lang = 'zh-CN';
          utterance.rate = 0.75;  // 稍慢一些，便于理解
          utterance.pitch = 1.2;  // 温和的音调
          utterance.volume = 0.9;
          
          utterance.onend = () => {
            currentIndex++;
            // 建议之间增加短暂停顿
            setTimeout(playNext, currentIndex === 1 ? 800 : 1200);
          };
          
          utterance.onerror = (event) => {
            console.log("语音播放出错:", event.error);
            setIsPlayingSuggestions(false);
          };
          
          speechSynthesis.speak(utterance);
        };
        
        playNext();
        
        console.log("开始播放休息建议");
        
      } catch (error) {
        console.log("语音播放失败:", error);
        setIsPlayingSuggestions(false);
      }
    } else {
      console.log("浏览器不支持语音合成功能");
    }
  };

  const stopRestSuggestions = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlayingSuggestions(false);
    console.log("停止播放休息建议");
  };

  // 当语音提醒关闭时，自动关闭自动播放休息建议
  useEffect(() => {
    if (!voiceReminderEnabled && autoPlaySuggestions) {
      setAutoPlaySuggestions(false);
    }
  }, [voiceReminderEnabled, autoPlaySuggestions]);

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
    autoPlaySuggestions,
    setAutoPlaySuggestions,
    selectedVoice,
    setSelectedVoice,
    availableVoices,
    playRestSuggestions,
    stopRestSuggestions,
    isPlayingSuggestions
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};