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
    <div className="mb-6">
      <Label className="block text-sm font-medium mb-3 text-blue-700">
        <Clock className="w-4 h-4 inline-block mr-1 text-blue-600" />
        Work Duration Settings
      </Label>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {presetTimes.map((preset) => (
          <Button
            key={preset.minutes}
            variant={timerDuration === preset.minutes * 60 ? "default" : "outline"}
            className={
              timerDuration === preset.minutes * 60 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "border-blue-200 text-blue-700 hover:bg-blue-50"
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
            className="w-full focus-visible:ring-blue-500"
            disabled={isDisabled}
            aria-label="Custom minutes"
          />
        </div>
        <Button 
          type="submit"
          variant="outline"
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
          disabled={isDisabled}
        >
          Set
        </Button>
      </form>
      
      <p className="text-xs text-blue-600 mb-4">Set work duration from 1-720 minutes</p>

      {/* Voice Reminder Settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-center space-x-2">
            {voiceReminderEnabled ? (
              <Volume2 className="w-4 h-4 text-blue-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-blue-400" />
            )}
            <span className="text-sm font-medium text-blue-700">Voice Reminders</span>
          </div>
          <div className="flex items-center space-x-2">
            {voiceReminderEnabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={testVoiceReminder}
                disabled={isDisabled}
                className="text-xs px-2 py-1 h-6 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
              >
                Test
              </Button>
            )}
            <div className="relative">
              <Switch
                checked={voiceReminderEnabled}
                onCheckedChange={setVoiceReminderEnabled}
                disabled={isDisabled}
                className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-blue-200"
              />
            </div>
          </div>
        </div>

        {voiceReminderEnabled && (
          <div className="space-y-3">
            {/* Voice Selection */}
            <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center space-x-2 mb-2">
                <Mic className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Select Voice</span>
              </div>
              <Select
                value={selectedVoice}
                onValueChange={setSelectedVoice}
                disabled={isDisabled}
              >
                <SelectTrigger className="w-full bg-white border-blue-200 focus:ring-blue-500">
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
            <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Auto-play Break Suggestions</span>
              </div>
              <Switch
                checked={autoPlaySuggestions}
                onCheckedChange={setAutoPlaySuggestions}
                disabled={isDisabled}
                className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-blue-200"
              />
            </div>
            
            <p className="text-xs text-blue-600 px-1">
              When timer ends, you'll hear a notification sound and gentle voice reminder{autoPlaySuggestions ? ', followed by auto-played break suggestions' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimerSettings; 