import { useState, useEffect, ReactNode } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plane, TrendingUp, DollarSign, Globe, Sparkles } from 'lucide-react';

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
    }
  };

  const handleLoginError = () => {
    console.error('Google Login Failed');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('skailinker_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Plane className="h-12 w-12 animate-bounce text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Preparing your journey...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl"></div>
        </div>

        {/* Floating planes animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Plane className="absolute top-1/4 left-1/4 w-8 h-8 text-blue-300/30 animate-float" />
          <Plane className="absolute top-2/3 right-1/4 w-6 h-6 text-indigo-300/20 animate-float-delayed" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Branding and features */}
            <div className="text-center md:text-left space-y-6">
              <div className="inline-flex items-center gap-4 mb-4">
                <img 
                  src="/SkaiLinker_Icon.png" 
                  alt="SkaiLinker Logo" 
                  className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-lg"
                />
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  SkaiLinker
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-medium">
                Your Smart Flight Companion
              </p>
              
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Discover the best flight deals, predict prices, and travel smarter with AI-powered insights.
              </p>

              {/* Feature highlights */}
              <div className="space-y-4 pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Price Predictions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered fare forecasting</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Best Deals</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Find unbeatable flight prices</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                    <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Global Coverage</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Search flights worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Login card */}
            <div className="flex justify-center md:justify-end">
              <div className="w-full max-w-md">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 p-8 md:p-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
                      <img 
                        src="/SkaiLinker_Icon.png" 
                        alt="SkaiLinker" 
                        className="w-full h-full object-contain drop-shadow-xl"
                      />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Welcome Back
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Sign in to unlock personalized flight insights
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 mb-6 border border-blue-100 dark:border-blue-900/50">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      ✨ What you'll get:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Personalized price alerts</li>
                      <li>• Save favorite routes</li>
                      <li>• Advanced search filters</li>
                      <li>• Travel history & analytics</li>
                    </ul>
                  </div>

                  {/* Google Login Button */}
                  <div className="flex flex-col items-center gap-4">
                    <GoogleLogin
                      onSuccess={handleLoginSuccess}
                      onError={handleLoginError}
                      useOneTap
                      auto_select
                      theme="outline"
                      size="large"
                      text="continue_with"
                      shape="rectangular"
                      width="350"
                    />
                    
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 px-4">
                      By continuing, you agree to our{' '}
                      <a href="#" className="text-primary hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </p>
                  </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-6 text-center space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🔒 Secure & encrypted login
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    We never store your Google password
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(45deg); }
            50% { transform: translateY(-20px) translateX(10px) rotate(45deg); }
          }
          
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(-45deg); }
            50% { transform: translateY(-15px) translateX(-10px) rotate(-45deg); }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .animate-float-delayed {
            animation: float-delayed 8s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // User is logged in - show minimal user bar
  return (
    <div>
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 flex justify-end items-center gap-3">
          <Avatar className="h-8 w-8 border-2 border-primary/20">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden sm:inline text-foreground">
            {user.name}
          </span>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            size="sm"
            className="text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
          >
            Logout
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}