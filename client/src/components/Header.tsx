import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Settings } from "lucide-react";

export default function Header() {
  const { user, isAuthenticated } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('skailinker_user');
    window.location.reload(); // Reload to trigger auth check
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="/SkaiLinker_Icon.png" 
                alt="SkaiLinker" 
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=SK';
                }}
              />
              <span className="text-xl font-bold">
                Skai<span className="text-primary">Linker</span>
              </span>
            </a>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/flights">
              <a className="text-sm font-medium hover:text-primary transition-colors">
                Flights
              </a>
            </Link>
            <Link href="/predictions">
              <a className="text-sm font-medium hover:text-primary transition-colors">
                Predictions
              </a>
            </Link>
            <Link href="/deals">
              <a className="text-sm font-medium hover:text-primary transition-colors">
                Deals
              </a>
            </Link>
            <Link href="/about">
              <a className="text-sm font-medium hover:text-primary transition-colors">
                About
              </a>
            </Link>
          </nav>

          {/* User Profile or Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={user.picture} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}