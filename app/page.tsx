import TaskInput from './components/TaskInput';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import TimerSettings from './components/TimerSettings';
import RestSuggestions from './components/RestSuggestions';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">工作休息提醒器</h1>
          <p className="text-gray-500 mt-2">保持专注，按时休息</p>
        </header>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <TaskInput />
          <TimerSettings />
          <TimerDisplay />
          <TimerControls />
        </div>
        
        <RestSuggestions />
      </div>
    </main>
  );
}