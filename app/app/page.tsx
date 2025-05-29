import TaskInput from './components/TaskInput';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import TimerSettings from './components/TimerSettings';
import RestSuggestions from './components/RestSuggestions';
import Link from 'next/link';
import { ArrowLeft, Timer, Settings, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/landing">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Timer className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-blue-700">FocusFlow</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Master Your Focus
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create the perfect work-break rhythm with AI-powered suggestions and mindful timing
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left Column - Timer Display (Hero) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100 h-full">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <h3 className="text-lg font-semibold text-gray-700">Focus Timer</h3>
              </div>
              <TimerDisplay />
              <div className="mt-8">
                <TimerControls />
              </div>
            </div>
          </div>

          {/* Right Column - Task & Settings */}
          <div className="space-y-8">
            
            {/* Task Input Card */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <Target className="w-5 h-5 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-700">Current Focus</h3>
              </div>
              <TaskInput />
            </div>

            {/* Settings Card */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <Settings className="w-5 h-5 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-700">Timer Settings</h3>
              </div>
              <TimerSettings />
            </div>

          </div>
        </div>

        {/* Bottom Section - Rest Suggestions */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
          <RestSuggestions />
        </div>

        {/* Footer Spacer */}
        <div className="h-20"></div>
      </div>
    </main>
  );
} 