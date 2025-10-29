// client/src/components/AuthGuard.tsx
// ✅ SIMPLIFIED - Facebook.com style login

import { ReactNode } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Plane, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, login, error, setError } = useAuth();

  const handleLoginSuccess = (credentialResponse: any) => {
    login(credentialResponse);
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
        {/* Simple Facebook-Style Login Page */}
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
          <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* LEFT SIDE - Company Branding (Simple) */}
            <div className="text-center lg:text-left">
              {/* Logo */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <img 
                  src="/assets/SkaiLinker_Icon.png" 
                  alt="SkaiLinker Logo" 
                  className="w-16 h-16 object-contain drop-shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/64x64/3B82F6/FFFFFF?text=SK';
                  }}
                />
                <h1 className="text-5xl lg:text-6xl font-bold text-blue-600 dark:text-blue-400">
                  SkaiLinker
                </h1>
              </div>
              
              {/* Tagline */}
              <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 font-normal max-w-md mx-auto lg:mx-0">
                SkaiLinker helps you find the best flight deals with AI-powered price predictions.
              </p>
            </div>

            {/* RIGHT SIDE - Login Card (Simple) */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 p-8">
                  
                  {/* Login Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                      Sign in to SkaiLinker
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Access AI predictions and personalized flight insights
                    </p>
                  </div>

                  {/* Google Login Button */}
                  <div className="mb-6">
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

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                        Secure Sign In
                      </span>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span>We never store your Google password</span>
                  </div>

                  {/* Terms */}
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
                    By signing in, you agree to our{' '}
                    <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Toast */}
        {error && (
          <div className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-up max-w-sm">
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
              className="mt-3 text-xs underline hover:no-underline"
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