import TaskInput from './components/TaskInput';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import TimerSettings from './components/TimerSettings';
import RestSuggestions from './components/RestSuggestions';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-700 drop-shadow-sm">工作休息提醒器</h1>
          <p className="text-amber-600 mt-2 font-medium">让工作更高效，让休息更及时</p>
        </header>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-amber-100">
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