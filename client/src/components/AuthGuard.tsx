import { useState, useEffect, ReactNode } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
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
                    <p className="text-sm text-gray-600 dark:t