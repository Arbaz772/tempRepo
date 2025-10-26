import { useState, useEffect, ReactNode } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    // Check if user is already logged in
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
      
      // Optional: Send to your backend for verification
      // fetch('/api/auth/google', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ credential: credentialResponse.credential })
      // });
      
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, show login screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
            {/* Logo or Brand */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                ✈️ SkaiLinker
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Your Smart Flight Companion
              </p>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Sign in with Google to access flight predictions, deals, and personalized travel insights.
              </p>
            </div>

            {/* Google Login Button */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                useOneTap
                auto_select
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            </div>

            {/* Privacy Notice */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User is logged in, add logout button to header area
  return (
    <div>
      {/* User Info Bar */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-2 flex justify-end items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            size="sm"
            className="text-xs"
          >
            Logout
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}