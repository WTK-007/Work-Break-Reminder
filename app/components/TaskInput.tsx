'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTimer } from '../providers/TimerProvider';
import { Pencil } from 'lucide-react';

const TaskInput: React.FC = () => {
  const { currentTask, setCurrentTask, timerState } = useTimer();

  return (
    <div className="mb-6">
      <Label htmlFor="task-input" className="block text-sm font-medium mb-2 text-amber-700">
        <Pencil className="w-4 h-4 inline-block mr-1 text-amber-600" />
        当前工作内容 <span className="text-red-500">*</span>
      </Label>
      <Input
        id="task-input"
        type="text"
        placeholder="输入你正在进行的工作..."
        value={currentTask}
        onChange={(e) => setCurrentTask(e.target.value)}
        disabled={timerState === 'running'}
        className="w-full bg-white border-amber-200 focus-visible:ring-amber-500 focus-visible:ring-offset-amber-200"
        required
      />
    </div>
  );
};

export default TaskInput;