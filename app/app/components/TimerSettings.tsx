'use client';

import React, { useState } from 'react';
import { useTimer } from '../../providers/TimerProvider';
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
    timerDuration > 0 ? (timerDuration / 60).toString() : ''
  );

  const presetTimes = [
    { label: '15 min', minutes: 15 },
    { label: '30 min', minutes: 30 },
    { label: '60 min', minutes: 60 },
    { label: '90 min', minutes: 90 },
    { label: '120 min', minutes: 120 },
  ];

  const handlePresetSelect = (minutes: number) => {
    const seconds = minutes * 60;
    setTimerDuration(seconds);
    setRemainingTime(seconds);
    setCustomMinutes(minutes.toString());
    
    // Reset state to idle and clear rest suggestions
    setTimerState('idle');
    setRestSuggestions([]);
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomMinutes(e.target.value);
  };

  const handleCustomTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(customMinutes, 10) || 1; // Default to 1 if invalid
    const clampedMinutes = Math.min(Math.max(minutes, 1), 720); // Range: 1-720 minutes
    const seconds = clampedMinutes * 60;
    
    setTimerDuration(seconds);
    setRemainingTime(seconds);
    setCustomMinutes(clampedMinutes.toString());
    
    // Reset state to idle and clear rest suggestions
    setTimerState('idle');
    setRestSuggestions([]);
  };

  const isDisabled = timerState === 'running';

  // Get simplified voice display name - only show the person's name
  const getVoiceDisplayName = (voice: SpeechSynthesisVoice) => {
    const allowedVoiceNames = ['Samantha', 'Aaron', 'Ralph'];
    
    // Find which allowed name this voice contains
    const foundName = allowedVoiceNames.find(name => voice.name.includes(name));
    
    // Return just the name if found, otherwise fall back to the voice name
    return foundName || voice.name;
  };

  const testVoiceReminder = () => {
    if ('speechSynthesis' in window) {
      const testText = "Hello, this is your selected voice for break reminders";
      const utterance = new SpeechSynthesisUtterance(testText);
      
      // Use currently selected voice
      if (selectedVoice) {
        const voices = speechSynthesis.getVoices();
        const chosenVoice = voices.find(voice => voice.name === selectedVoice);
        if (chosenVoice) {
          utterance.voice = chosenVoice;
          console.log("Testing voice details:", {
            name: chosenVoice.name,
            lang: chosenVoice.lang,
            voiceURI: chosenVoice.voiceURI,
            localService: chosenVoice.localService
          });
        }
      }
      
      utterance.lang = 'en-US';
      utterance.rate = 0.9;   // Clear speaking rate
      utterance.pitch = 1.0;  // Natural pitch
      utterance.volume = 1.0; // Full volume for clarity
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Duration Settings */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          Duration
        </Label>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          {presetTimes.map((preset) => (
            <Button
              key={preset.minutes}
              variant={timerDuration === preset.minutes * 60 ? "default" : "outline"}
              className={
                timerDuration === preset.minutes * 60 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }
              onClick={() => handlePresetSelect(preset.minutes)}
              disabled={isDisabled}
              size="sm"
            >
              {preset.label}
            </Button>
          ))}
        </div>
        
        <form onSubmit={handleCustomTimeSubmit} className="flex gap-2">
          <Input
            type="number"
            min="1"
            max="720"
            value={customMinutes}
            onChange={handleCustomTimeChange}
            placeholder="Custom minutes"
            className="flex-1 text-sm border-gray-200 focus-visible:ring-blue-500 focus-visible:border-blue-500"
            disabled={isDisabled}
          />
          <Button 
            type="submit"
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 px-4"
            disabled={isDisabled}
            size="sm"
          >
            Set
          </Button>
        </form>
        
        <p className="text-xs text-gray-500 mt-2">1-720 minutes</p>
      </div>

      {/* Voice Settings */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700 flex items-center">
          <Volume2 className="w-4 h-4 mr-2 text-gray-500" />
          Voice Reminders
        </Label>
        
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
          <span className="text-sm text-gray-700">Enable voice notifications</span>
          <div className="flex items-center space-x-2">
            {voiceReminderEnabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={testVoiceReminder}
                disabled={isDisabled}
                className="text-xs px-2 py-1 h-7"
              >
                Test
              </Button>
            )}
            <Switch
              checked={voiceReminderEnabled}
              onCheckedChange={setVoiceReminderEnabled}
              disabled={isDisabled}
            />
          </div>
        </div>

        {voiceReminderEnabled && (
          <div className="space-y-3">
            {/* Voice Selection */}
            <div>
              <Label className="text-xs text-gray-600 mb-2 flex items-center">
                <Mic className="w-3 h-3 mr-1" />
                Voice
              </Label>
              <Select
                value={selectedVoice}
                onValueChange={setSelectedVoice}
                disabled={isDisabled}
              >
                <SelectTrigger className="w-full bg-white border-gray-200">
                  <SelectValue placeholder="Choose a voice..." />
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
            
            {/* Auto-play suggestions toggle */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-700">Auto-play break suggestions</span>
              <Switch
                checked={autoPlaySuggestions}
                onCheckedChange={setAutoPlaySuggestions}
                disabled={isDisabled}
              />
            </div>
            
            <p className="text-xs text-gray-500">
              Get audio notifications and personalized break suggestions when your focus session ends
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimerSettings; 