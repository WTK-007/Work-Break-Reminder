import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Brain, 
  Volume2, 
  Zap, 
  Timer, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  Users,
  TrendingUp,
  Shield,
  Smartphone,
  Globe
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">FocusFlow</span>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Help</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Sign In
              </Button>
              <Link href="/app">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Try Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
              🚀 AI-Powered Focus Timer
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master Your Focus with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI-Powered </span>
              Work Sessions
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Boost productivity with intelligent break suggestions, gentle voice reminders, 
              and personalized focus sessions. Transform your work habits today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/app">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                Watch Demo
              </Button>
            </div>
            
            {/* Product Preview */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                      <Clock className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">25:00</h3>
                    <p className="text-gray-600">Focus Session Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FocusFlow?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Scientifically proven techniques meet cutting-edge AI to maximize your productivity
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Break Suggestions</h3>
              <p className="text-gray-600">
                Get personalized rest activities based on your work type and session length. 
                Science-backed recommendations for optimal recovery.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Volume2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Gentle Voice Reminders</h3>
              <p className="text-gray-600">
                Soothing voice notifications with multiple language options. 
                Never miss a break with our intelligent reminder system.
              </p>
            </Card>
            
            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Boost Productivity 3x</h3>
              <p className="text-gray-600">
                Users report 3x higher focus levels and 50% less burnout. 
                Transform your work habits with proven time management.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Maximum Focus
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to master your productivity and maintain healthy work habits
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800">Smart Timer</Badge>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Customizable Focus Sessions
              </h3>
              <p className="text-gray-600 mb-6">
                Set custom work durations from 15 minutes to 12 hours. Choose from preset times 
                or create your own schedule. Smart state management ensures you never lose progress.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Preset timers: 15, 30, 60, 90, 120 minutes
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Custom duration up to 720 minutes
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Pause, resume, and reset functionality
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">Work Session</h4>
                  <Timer className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">25:00</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                </div>
                <p className="text-sm text-gray-600">Deep Work Session • 75% Complete</p>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <Badge className="mb-4 bg-purple-100 text-purple-800">AI Assistant</Badge>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Intelligent Break Recommendations
              </h3>
              <p className="text-gray-600 mb-6">
                Our AI analyzes your work type and session length to suggest the perfect break activities. 
                From meditation to physical exercises, get personalized recommendations every time.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Personalized based on work content
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Voice-enabled suggestion playback
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Multiple activity categories
                </li>
              </ul>
            </div>
            <div className="lg:order-1 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Brain className="w-5 h-5 text-purple-600 mr-2" />
                  Break Suggestions
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <p className="text-sm text-gray-700">Take a 5-minute walk outside for fresh air</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <p className="text-sm text-gray-700">Do simple neck and shoulder stretches</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <p className="text-sm text-gray-700">Practice deep breathing exercises</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of users who have transformed their productivity
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "FocusFlow has completely changed how I work. The AI suggestions are spot-on, 
                and I'm 3x more productive than before."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Chen</p>
                  <p className="text-sm text-gray-600">Product Manager, TechCorp</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The voice reminders are so gentle and helpful. I finally have a healthy work-life balance."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900">Marcus Johnson</p>
                  <p className="text-sm text-gray-600">Freelance Designer</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "My team's productivity increased by 50% after implementing FocusFlow. Game changer!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900">Emily Rodriguez</p>
                  <p className="text-sm text-gray-600">Engineering Lead, StartupXYZ</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have mastered their focus with FocusFlow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Start 14-Day Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that works best for you
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Basic</h3>
              <p className="text-gray-600 mb-6">Perfect for individuals getting started</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">Free</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Basic timer functionality
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  5 AI suggestions per day
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Standard voice reminders
                </li>
              </ul>
              <Link href="/app">
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              </Link>
            </Card>
            
            <Card className="p-8 border-2 border-blue-500 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                Most Popular
              </Badge>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-600 mb-6">For professionals who want more</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">$9</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Unlimited AI suggestions
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Premium voice options
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Advanced analytics
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Custom break templates
                </li>
              </ul>
              <Link href="/app">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                </Button>
              </Link>
            </Card>
            
            <Card className="p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For teams and organizations</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Everything in Pro
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Team management
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  API access
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Priority support
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Contact Sales
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">FocusFlow</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transform your productivity with AI-powered focus sessions and intelligent break suggestions.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FocusFlow, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 