import { useState, useEffect, ReactNode } from 'react';
import { Plane, TrendingUp, DollarSign, Globe, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  picture: string;
  sub: string;
  credential: string;
}

interface AuthGuardProps {
  children: ReactNode;
}

// Mock Google Login for demo
const MockGoogleLogin = ({ onSuccess }: any) => (
  <button 
    onClick={() => onSuccess({ credential: 'mock-token' })}
    className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 border-2 border-gray-200 hover:border-blue-400 group text-sm sm:text-base"
  >
    <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    <span className="hidden xs:inline">Continue with Google</span>
    <span className="xs:hidden">Google Login</span>
    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
  </button>
);

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('skailinker_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('skailinker_user');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (credentialResponse: any) => {
    try {
      const userData: UserData = {
        name: 'Demo User',
        email: 'demo@skailinker.com',
        picture: 'https://via.placeholder.com/100',
        sub: 'demo-123',
        credential: credentialResponse.credential
      };
      
      setUser(userData);
      localStorage.setItem('skailinker_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 blur-xl opacity-50">
              <Plane className="h-16 w-16 text-blue-400 animate-pulse mx-auto" />
            </div>
            <Plane className="h-16 w-16 text-blue-400 animate-bounce mx-auto relative" />
          </div>
          <p className="text-xl text-blue-200 mt-6 font-medium">Preparing your journey...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orbs */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          
          {/* Floating planes */}
          <Plane className="absolute top-1/4 left-1/4 w-12 h-12 text-blue-400/20 animate-float" />
          <Plane className="absolute top-1/3 right-1/3 w-8 h-8 text-indigo-400/30 animate-float-delayed" />
          <Plane className="absolute bottom-1/4 left-1/3 w-10 h-10 text-purple-400/20 animate-float" style={{ animationDelay: '2s' }} />
          <Plane className="absolute top-2/3 right-1/4 w-6 h-6 text-blue-300/25 animate-float-delayed" style={{ animationDelay: '3s' }} />
          
          {/* Sparkles */}
          <Sparkles className="absolute top-20 right-20 w-8 h-8 text-yellow-400/40 animate-pulse" />
          <Sparkles className="absolute bottom-32 left-32 w-6 h-6 text-yellow-300/30 animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Hero content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <img 
                    src="assets/SkaiLinker_Icon.png" 
                    alt="SkaiLinker Logo" 
                    className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 object-contain drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    SkaiLinker
                  </h1>
                  <p className="text-blue-300 text-xs sm:text-sm font-medium mt-1 tracking-widest">YOUR SMART FLIGHT COMPANION</p>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight px-4 sm:px-0">
                  Travel Smarter with
                  <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                    AI-Powered Insights
                  </span>
                </h2>
                
                <p className="text-blue-200 text-base sm:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 px-4 sm:px-0">
                  Discover unbeatable flight deals, predict price trends, and plan your perfect journey with intelligent recommendations.
                </p>
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 px-4 sm:px-0">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-blue-400/50 group">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 sm:p-3 rounded-lg sm:rounded-xl w-fit mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Price Predictions</h3>
                  <p className="text-xs sm:text-sm text-blue-200">AI-powered fare forecasting</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-green-400/50 group">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 sm:p-3 rounded-lg sm:rounded-xl w-fit mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Best Deals</h3>
                  <p className="text-xs sm:text-sm text-blue-200">Unbeatable flight prices</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-purple-400/50 group">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2.5 sm:p-3 rounded-lg sm:rounded-xl w-fit mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Global Coverage</h3>
                  <p className="text-xs sm:text-sm text-blue-200">Worldwide destinations</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 pt-4 px-4 sm:px-0">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-white">500K+</div>
                  <div className="text-blue-300 text-xs sm:text-sm">Happy Travelers</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-white">1M+</div>
                  <div className="text-blue-300 text-xs sm:text-sm">Flights Tracked</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-white">95%</div>
                  <div className="text-blue-300 text-xs sm:text-sm">Accuracy Rate</div>
                </div>
              </div>
            </div>

            {/* Right side - Login card */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="w-full max-w-md px-4 sm:px-0">
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
                  
                  {/* Card */}
                  <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-10">
                    <div className="text-center mb-6 sm:mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 relative">
                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                        <img 
                          src="assets/SkaiLinker_Icon.png" 
                          alt="SkaiLinker" 
                          className="relative w-full h-full object-contain drop-shadow-xl"
                        />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Welcome Back!
                      </h2>
                      <p className="text-blue-200 text-sm sm:text-base">
                        Sign in to unlock your personalized travel dashboard
                      </p>
                    </div>

                    {/* Benefits section */}
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6 border border-blue-400/20 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                        <p className="text-xs sm:text-sm font-bold text-white">
                          Unlock Premium Features
                        </p>
                      </div>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-xs sm:text-sm text-blue-100">
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>Personalized price alerts & notifications</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs sm:text-sm text-blue-100">
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>Save favorite routes & destinations</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs sm:text-sm text-blue-100">
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>Advanced AI-powered search filters</span>
                        </li>
                        <li className="flex items-start gap-2 text-xs sm:text-sm text-blue-100">
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>Travel history & detailed analytics</span>
                        </li>
                      </ul>
                    </div>

                    {/* Google Login Button */}
                    <div className="space-y-4">
                      <MockGoogleLogin onSuccess={handleLoginSuccess} />
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs sm:text-sm">
                          <span className="px-3 sm:px-4 text-blue-300 bg-gray-900">or continue with email</span>
                        </div>
                      </div>

                      <button className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 text-sm sm:text-base">
                        Sign in with Email
                      </button>
                    </div>

                    <p className="text-xs text-center text-blue-300/70 mt-5 sm:mt-6 px-2 sm:px-4">
                      By continuing, you agree to our{' '}
                      <a href="/terms" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Terms of Service</a>
                      {' '}and{' '}
                      <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Privacy Policy</a>
                    </p>
                  </div>
                </div>

                {/* Security badge */}
                <div className="mt-5 sm:mt-6 text-center space-y-2">
                  <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-medium">Secure & encrypted login</span>
                  </div>
                  <p className="text-xs text-blue-300/60">
                    🔒 We never store your Google password
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(45deg); }
            50% { transform: translateY(-30px) translateX(15px) rotate(45deg); }
          }
          
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(-45deg); }
            50% { transform: translateY(-25px) translateX(-15px) rotate(-45deg); }
          }
          
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          
          .animate-float-delayed {
            animation: float-delayed 10s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}