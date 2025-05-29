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
  addTime: (minutes: number) => void;
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
  const [timerDuration, setTimerDuration] = useState<number>(0); // Default 0 seconds - no default time
  const [remainingTime, setRemainingTime] = useState<number>(0);
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
        
        // Filter for specific voices only - keep only the requested voices, one per name
        const allowedVoiceNames = ['Samantha', 'Aaron', 'Ralph'];
        const uniqueVoices: SpeechSynthesisVoice[] = [];
        
        // For each allowed name, find the best matching voice
        allowedVoiceNames.forEach(allowedName => {
          const matchingVoices = voices.filter(voice => voice.name.includes(allowedName));
          
          if (matchingVoices.length > 0) {
            // Select the best voice for this name (prefer local/high-quality voices)
            const bestVoice = matchingVoices.sort((a, b) => {
              // Prefer local voices
              if (a.localService && !b.localService) return -1;
              if (!a.localService && b.localService) return 1;
              
              // Prefer voices with fewer extra words in name (simpler names are usually better)
              const aWordCount = a.name.split(' ').length;
              const bWordCount = b.name.split(' ').length;
              if (aWordCount < bWordCount) return -1;
              if (aWordCount > bWordCount) return 1;
              
              return 0;
            })[0];
            
            uniqueVoices.push(bestVoice);
          }
        });
        
        // Sort by preference: female voices first, then alphabetical
        const sortedVoices = uniqueVoices.sort((a, b) => {
          // Prefer female voices (usually contain these keywords)
          const aIsFemale = /female|woman|girl|samantha/i.test(a.name);
          const bIsFemale = /female|woman|girl|samantha/i.test(b.name);
          
          if (aIsFemale && !bIsFemale) return -1;
          if (!aIsFemale && bIsFemale) return 1;
          
          // Alphabetical order as secondary sort
          const aName = allowedVoiceNames.find(name => a.name.includes(name)) || a.name;
          const bName = allowedVoiceNames.find(name => b.name.includes(name)) || b.name;
          return aName.localeCompare(bName);
        });
        
        setAvailableVoices(sortedVoices);
        setIsVoicesLoaded(true);
        console.log("Loaded high-quality voices:", sortedVoices.map(v => `${v.name} (${v.lang})`));
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
      const voicePreferences = [
        'Samantha', // Usually female voice, high quality
        'Aaron',    // Male voice, clear
        'Ralph'     // Male voice, deep
      ];
      
      let bestVoice = null;
      for (const preference of voicePreferences) {
        bestVoice = availableVoices.find(voice => 
          voice.name.includes(preference)
        );
        if (bestVoice) break;
      }
      
      // 如果没有找到偏好语音，选择第一个可用的
      if (!bestVoice && availableVoices.length > 0) {
        bestVoice = availableVoices[0];
      }
      
      if (bestVoice) {
        console.log("Auto-selected voice:", bestVoice.name);
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
      
      console.log("Auto-playing break suggestions");
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
            console.log("Timer completed, preparing to play notification");
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
    
    // Use default task description if no task is provided
    const taskForAPI = currentTask.trim() || 'focused work';
    
    console.log(`Fetching break suggestions for task: "${taskForAPI}", duration: ${Math.floor(timerDuration / 60)} minutes`);
    
    try {
      const response = await fetch("/api/rest-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentTask: taskForAPI,
          timerDuration
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API returned break suggestions:", data.suggestions);
      setRestSuggestions(data.suggestions);
      
    } catch (error) {
      console.error("Error fetching rest suggestions:", error);
      // 使用多样化的随机默认建议作为后备
      const diverseDefaultSuggestions = [
        "Take a 5-minute walk outside for fresh air and light exercise",
        "Do simple neck and shoulder stretches to release tension",
        "Practice deep breathing exercises for 3 minutes",
        "Make a cup of tea and sip it mindfully",
        "Look out the window and find three things you haven't noticed before",
        "Do some light desk exercises or gentle yoga poses",
        "Listen to a favorite song and move to the rhythm",
        "Write down three things you're grateful for today",
        "Tidy up your workspace to create a cleaner environment",
        "Close your eyes and practice a brief meditation"
      ];
      
      // 随机选择3个不同的建议
      const randomSuggestions = diverseDefaultSuggestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      console.log("API call failed, using random default suggestions:", randomSuggestions);
      setRestSuggestions(randomSuggestions);
      
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const playNotificationSound = () => {
    console.log("playNotificationSound called, ref status:", notificationSoundPlayedRef.current);
    
    // 检查是否已播放过
    if (notificationSoundPlayedRef.current) {
      console.log("Notification sound already played, skipping");
      return;
    }
    
    // 标记为已播放
    notificationSoundPlayedRef.current = true;
    console.log("Setting ref to true, starting notification sound");
    
    // 创建并播放提示音
    try {
    const audio = new Audio('/notification.mp3');
      audio.volume = 0.8;
      
      audio.play()
        .then(() => {
          console.log("✅ Notification sound played successfully");
        })
        .catch(e => {
          console.log("❌ Notification sound failed to play:", e);
        });
        
    } catch (error) {
      console.log("❌ Failed to create audio object:", error);
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
        // 创建英文语音提醒内容
        const reminderText = `Your ${Math.floor(timerDuration / 60)}-minute focus session is complete. Time to take a well-deserved break.`;
        
        // 创建语音合成实例
        const utterance = new SpeechSynthesisUtterance(reminderText);
        
        // 使用用户选择的语音
        if (selectedVoice) {
          const voices = speechSynthesis.getVoices();
          const chosenVoice = voices.find(voice => voice.name === selectedVoice);
          if (chosenVoice) {
            utterance.voice = chosenVoice;
            console.log("Using selected voice:", chosenVoice.name);
          }
        }
        
        // 设置清晰的语音参数
        utterance.lang = 'en-US';
        utterance.rate = 0.9;   // 稍快一些，更清晰
        utterance.pitch = 1.0;  // 自然的音调
        utterance.volume = 1.0; // 最大音量确保清晰
        
        // 添加语音事件监听
        utterance.onstart = () => {
          console.log("Gentle voice reminder started playing");
        };
        
        utterance.onend = () => {
          console.log("Voice reminder playback completed");
          setVoiceReminderCompleted(true);
        };
        
        utterance.onerror = (event) => {
          console.log("Voice playback error:", event.error);
        };
        
        // 播放语音提醒
        speechSynthesis.speak(utterance);
        
      } catch (error) {
        console.log("Voice reminder playback failed:", error);
      }
    } else {
      console.log("Browser does not support speech synthesis");
    }
  };

  const startTimer = useCallback(() => {
    // 验证计时时长
    if (timerDuration <= 0) {
      console.log("Cannot start timer: timer duration is not set");
      return;
    }
    
    // 重置所有状态
    setHasPlayedSuggestions(false);
    setVoiceReminderCompleted(false);
    setHasPlayedNotificationSound(false);
    
    // 使用ref重置，更可靠
    notificationSoundPlayedRef.current = false;
    currentTimerSessionRef.current += 1; // 增加会话ID
    
    console.log(`Starting new timer session: ${currentTimerSessionRef.current}`);
    
    if (timerState === 'completed') {
      setRemainingTime(timerDuration);
      setRestSuggestions([]);
    }
    
    // 在计时开始前预先获取休息建议
    console.log("Pre-fetching break suggestions before timer starts");
    fetchRestSuggestions();
    
    // 设置计时器状态为运行
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

  // 增加计时器时间的方法
  const addTime = useCallback((minutes: number) => {
    const addedSeconds = minutes * 60;
    
    // 增加总时长
    const newDuration = timerDuration + addedSeconds;
    setTimerDuration(newDuration);
    
    // 增加剩余时间
    setRemainingTime(prevTime => prevTime + addedSeconds);
    
    // 保存到localStorage
    localStorage.setItem('timerDuration', newDuration.toString());
    
    console.log(`Added ${minutes} minutes to timer. New duration: ${Math.floor(newDuration / 60)} minutes`);
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
        // 准备播放的文本内容，使用英文
        const introText = "Here are some refreshing break activities for you";
        const suggestionTexts = restSuggestions.map((suggestion, index) => 
          `Option ${index + 1}: ${suggestion}`
        );
        const outroText = "Choose one that appeals to you and enjoy your break";
        
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
          
          // 设置清晰的语音参数
          utterance.lang = 'en-US';
          utterance.rate = 0.9;   // 稍快一些，更清晰
          utterance.pitch = 1.0;  // 自然的音调
          utterance.volume = 1.0; // 最大音量确保清晰
          
          utterance.onend = () => {
            currentIndex++;
            // 建议之间增加短暂停顿
            setTimeout(playNext, currentIndex === 1 ? 800 : 1200);
          };
          
          utterance.onerror = (event) => {
            console.log("Voice playback error:", event.error);
            setIsPlayingSuggestions(false);
          };
          
          speechSynthesis.speak(utterance);
        };
        
        playNext();
        
        console.log("Started playing break suggestions");
        
      } catch (error) {
        console.log("Voice playback failed:", error);
        setIsPlayingSuggestions(false);
      }
    } else {
      console.log("Browser does not support speech synthesis");
    }
  };

  const stopRestSuggestions = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlayingSuggestions(false);
    console.log("Stopped playing break suggestions");
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
    addTime,
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