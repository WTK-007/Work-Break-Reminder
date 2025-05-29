'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTimer } from '../../providers/TimerProvider';
import { Pencil } from 'lucide-react';

const TaskInput: React.FC = () => {
  const { currentTask, setCurrentTask, timerState } = useTimer();

  return (
    <div className="mb-6">
      <Label htmlFor="task-input" className="block text-sm font-medium mb-2 text-blue-700">
        <Pencil className="w-4 h-4 inline-block mr-1 text-blue-600" />
        Current Task (Optional)
      </Label>
      <Input
        id="task-input"
        type="text"
        placeholder="Enter your current work task... (optional)"
        value={currentTask}
        onChange={(e) => setCurrentTask(e.target.value)}
        disabled={timerState === 'running'}
        className="w-full bg-white border-blue-200 focus-visible:ring-blue-500 focus-visible:ring-offset-blue-200"
      />
    </div>
  );
};

export default TaskInput; 