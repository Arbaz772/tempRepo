import { useState, useEffect } from 'react';

interface UserData {
  name: string;
  email: string;
  picture: string;
  sub: string;
  credential: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('skailinker_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Listen for storage changes (logout from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'skailinker_user') {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { 
    user, 
    isAuthenticated: !!user,
    email: user?.email,
    name: user?.name,
    picture: user?.picture
  };
}