'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTimer } from '../../providers/TimerProvider';
import { Pencil } from 'lucide-react';

const TaskInput: React.FC = () => {
  const { currentTask, setCurrentTask, timerState } = useTimer();

  return (
    <div className="space-y-3">
      <Label htmlFor="task-input" className="text-sm font-medium text-gray-700 flex items-center">
        <Pencil className="w-4 h-4 mr-2 text-gray-500" />
        What are you working on? (Optional)
      </Label>
      <Input
        id="task-input"
        type="text"
        placeholder="Enter your current work task... (optional)"
        value={currentTask}
        onChange={(e) => setCurrentTask(e.target.value)}
        disabled={timerState === 'running'}
        className="w-full bg-white border-gray-200 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 text-base py-3 px-4 rounded-xl disabled:bg-gray-50 disabled:text-gray-500"
      />
      {currentTask && (
        <p className="text-xs text-gray-500 mt-2">
          This will help generate personalized break suggestions
        </p>
      )}
    </div>
  );
};

export default TaskInput; 