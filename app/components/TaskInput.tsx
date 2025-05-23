'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTimer } from '../providers/TimerProvider';

const TaskInput: React.FC = () => {
  const { currentTask, setCurrentTask, timerState } = useTimer();

  return (
    <div className="mb-6">
      <Label htmlFor="task-input" className="block text-sm font-medium mb-2">
        当前工作内容 <span className="text-red-500">*</span>
      </Label>
      <Input
        id="task-input"
        type="text"
        placeholder="输入你正在进行的工作..."
        value={currentTask}
        onChange={(e) => setCurrentTask(e.target.value)}
        disabled={timerState === 'running'}
        className="w-full bg-white border-gray-200 focus:border-[#07C160] focus:ring-[#07C160]"
        required
      />
    </div>
  );
};

export default TaskInput;