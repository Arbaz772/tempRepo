// client/src/components/AuthGuard.tsx
// ✅ REDESIGNED - Facebook-style login page

import { useState, useEffect, ReactNode } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Plane, TrendingUp, DollarSign, Globe, Sparkles, Shield, Award, Clock } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  picture: string;
  sub: string;
  credential: string;
}

interface DecodedToken {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('skailinker_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('skailinker_user');
        setError('Session expired. Please log in again.');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (credentialResponse: any) => {
    try {
      setError(null);
      const decoded = jwtDecode<DecodedToken>(credentialResponse.credential);
      const userData: UserData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        sub: decoded.sub,
        credential: credentialResponse.credential
      };
      
      setUser(userData);
      localStorage.setItem('skailinker_user', JSON.stringify(userData));
      
      console.log('User logged in:', userData);
    } catch (error) {
      console.error('Error decoding token:', error);
      setError('Failed to process login. Please try again.');
    }
  };

  const handleLoginError = () => {
    console.error('Google Login Failed');
    setError('Login failed. Please check your connection and try again.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="text-center">
          <Plane className="h-12 w-12 animate-bounce text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">Preparing your journey...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading SkaiLinker</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {/* Facebook-Style Login Page */}
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
          <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
              
              {/* LEFT SIDE - Company Branding */}
              <div className="text-center lg:text-left space-y-8">
                {/* Logo & Brand Name */}
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <img 
                    src="/assets/SkaiLinker_Icon.png" 
                    alt="SkaiLinker Logo" 
                    className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=SK';
                    }}
                  />
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    SkaiLinker
                  </h1>
                </div>
                
                {/* Tagline */}
                <div className="space-y-4">
                  <p className="text-2xl md:text-3xl text-gray-800 dark:text-gray-200 font-semibold">
                    Your Smart Flight Companion
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Discover the best flight deals, predict prices with AI, and travel smarter. 
                    Join thousands of travelers saving on every journey.
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">AI Predictions</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Smart fare forecasting</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Best Deals</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Unbeatable prices</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Global Coverage</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Worldwide flights</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Smart Insights</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Personalized tips</p>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Secure & Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Trusted Platform</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE - Login Card */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-md">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-10">
                    {/* Login Header */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
                        <Plane className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        Welcome Back
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Sign in to access AI predictions
                      </p>
                    </div>

                    {/* Benefits Box */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-5 mb-8 border border-blue-100 dark:border-blue-900/50">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Premium Features Unlocked:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                          AI-powered price predictions
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                          Personalized flight alerts
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                          Save favorite routes
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                          Advanced search filters
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                          Travel history & analytics
                        </li>
                      </ul>
                    </div>

                    {/* Google Login Button */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-full flex justify-center">
                        <GoogleLogin
                          onSuccess={handleLoginSuccess}
                          onError={handleLoginError}
                          useOneTap
                          theme="outline"
                          size="large"
                          text="continue_with"
                          shape="rectangular"
                          width="350"
                        />
                      </div>
                      
                      {/* Privacy Notice */}
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed">
                        By continuing, you agree to our{' '}
                        <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Privacy Policy</a>
                      </p>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="font-medium">Secure Login</span>
                        <span className="text-gray-400">•</span>
                        <span>We never store your password</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      New to SkaiLinker? Sign up is automatic with Google
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Error Toast */}
        {error && (
          <div className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-slide-up max-w-sm border border-red-500">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-1 rounded">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Login Failed</p>
                <p className="text-sm mt-1 opacity-90">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => setError(null)}
              className="mt-3 text-xs underline hover:no-underline font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        <style>{`
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        `}</style>
      </>
    );
  }

  return <>{children}</>;
}