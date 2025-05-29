import TaskInput from './components/TaskInput';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import TimerSettings from './components/TimerSettings';
import RestSuggestions from './components/RestSuggestions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Back to Landing Page */}
        <div className="mb-6">
          <Link href="/landing">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700 drop-shadow-sm">FocusFlow</h1>
          <p className="text-blue-600 mt-2 font-medium">Master Your Focus, Optimize Your Breaks</p>
        </header>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-blue-100">
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