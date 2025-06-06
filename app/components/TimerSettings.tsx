'use client';

import React, { useState } from 'react';
import { useTimer } from '../providers/TimerProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Volume2, VolumeX, Mic } from 'lucide-react';

const TimerSettings: React.FC = () => {
  const { 
    timerDuration, 
    setTimerDuration, 
    setRemainingTime, 
    timerState, 
    setTimerState,
    setRestSuggestions,
    voiceReminderEnabled,
    setVoiceReminderEnabled,
    autoPlaySuggestions,
    setAutoPlaySuggestions,
    selectedVoice,
    setSelectedVoice,
    availableVoices
  } = useTimer();
  const [customMinutes, setCustomMinutes] = useState<string>(
    (timerDuration / 60).toString()
  );

  const presetTimes = [
    { label: '15分钟', minutes: 15 },
    { label: '30分钟', minutes: 30 },
    { label: '60分钟', minutes: 60 },
    { label: '90分钟', minutes: 90 },
    { label: '120分钟', minutes: 120 },
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
    const clampedMinutes = Math.min(Math.max(minutes, 1), 720); // 调整为1-720分钟范围
    const seconds = clampedMinutes * 60;
    
    setTimerDuration(seconds);
    setRemainingTime(seconds);
    setCustomMinutes(clampedMinutes.toString());
    
    // 重置状态为idle并清空休息建议
    setTimerState('idle');
    setRestSuggestions([]);
  };

  const isDisabled = timerState === 'running';

  // 获取语音显示名称（简化版本）
  const getVoiceDisplayName = (voice: SpeechSynthesisVoice) => {
    let name = voice.name;
    
    // 瑶瑶（甜美女声）
    if (name.includes('Microsoft Yaoyao')) return '瑶瑶(甜美女声)';
    
    // Google语音处理
    if (name.includes('Google')) {
      // 婷婷（普通话）- 中国大陆版本
      if (name.includes('中国大陆') || name.includes('Mainland') || voice.lang === 'zh-CN') {
        return '婷婷(娇柔女生)';
      }
      // 小花（粤语）- 香港版本
      if (name.includes('香港') || name.includes('Hong Kong') || voice.lang === 'zh-HK') {
        return '花花(粤语女声)';
      }
    }
    
    // 默认显示（不应该到达这里）
    return `${name}（${voice.lang}）`;
  };

  const testVoiceReminder = () => {
    if ('speechSynthesis' in window) {
      const testText = "工作辛苦了,休息一下吧";
      const utterance = new SpeechSynthesisUtterance(testText);
      
      // 使用当前选择的语音
      if (selectedVoice) {
        const voices = speechSynthesis.getVoices();
        const chosenVoice = voices.find(voice => voice.name === selectedVoice);
        if (chosenVoice) {
          utterance.voice = chosenVoice;
          console.log("测试语音详情:", {
            name: chosenVoice.name,
            lang: chosenVoice.lang,
            voiceURI: chosenVoice.voiceURI,
            localService: chosenVoice.localService
          });
        }
      }
      
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      utterance.pitch = 1.3;
      utterance.volume = 0.9;
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="mb-6">
      <Label className="block text-sm font-medium mb-3 text-amber-700">
        <Clock className="w-4 h-4 inline-block mr-1 text-amber-600" />
        工作时长设置
      </Label>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {presetTimes.map((preset) => (
          <Button
            key={preset.minutes}
            variant={timerDuration === preset.minutes * 60 ? "default" : "outline"}
            className={
              timerDuration === preset.minutes * 60 
                ? "bg-amber-600 hover:bg-amber-700 text-white" 
                : "border-amber-200 text-amber-700 hover:bg-amber-50"
            }
            onClick={() => handlePresetSelect(preset.minutes)}
            disabled={isDisabled}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      
      <form onSubmit={handleCustomTimeSubmit} className="flex gap-2 mb-1">
        <div className="flex-1">
          <Input
            type="number"
            min="1"
            max="720"
            value={customMinutes}
            onChange={handleCustomTimeChange}
            className="w-full focus-visible:ring-amber-500"
            disabled={isDisabled}
            aria-label="自定义分钟数"
          />
        </div>
        <Button 
          type="submit"
          variant="outline"
          className="border-amber-300 text-amber-700 hover:bg-amber-50"
          disabled={isDisabled}
        >
          设置
        </Button>
      </form>
      
      <p className="text-xs text-amber-600 mb-4">可设置1-720分钟范围的工作时长</p>

      {/* 语音提醒设置 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border border-amber-200 rounded-lg bg-amber-50">
          <div className="flex items-center space-x-2">
            {voiceReminderEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-sm font-medium text-amber-700">语音提醒</span>
          </div>
          <div className="flex items-center space-x-2">
            {voiceReminderEnabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={testVoiceReminder}
                disabled={isDisabled}
                className="text-xs px-2 py-1 h-6 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white"
              >
                试听
              </Button>
            )}
            <div className="relative">
              <Switch
                checked={voiceReminderEnabled}
                onCheckedChange={setVoiceReminderEnabled}
                disabled={isDisabled}
                className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-amber-200"
              />
            </div>
          </div>
        </div>

        {voiceReminderEnabled && (
          <div className="space-y-3">
            {/* 语音选择 */}
            <div className="p-3 border border-amber-200 rounded-lg bg-amber-50">
              <div className="flex items-center space-x-2 mb-2">
                <Mic className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">选择语音</span>
              </div>
              <Select
                value={selectedVoice}
                onValueChange={setSelectedVoice}
                disabled={isDisabled}
              >
                <SelectTrigger className="w-full bg-white border-amber-200 focus:ring-amber-500">
                  <SelectValue placeholder="选择一个语音..." />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {getVoiceDisplayName(voice)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* 自动播放建议开关 */}
            <div className="flex items-center justify-between p-3 border border-amber-200 rounded-lg bg-amber-50">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">自动播放休息建议</span>
              </div>
              <Switch
                checked={autoPlaySuggestions}
                onCheckedChange={setAutoPlaySuggestions}
                disabled={isDisabled}
                className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-amber-200"
              />
            </div>
            
            <p className="text-xs text-amber-600 px-1">
              计时结束后将播放提示音和温柔的语音提醒{autoPlaySuggestions ? '，然后自动播放休息建议' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimerSettings;