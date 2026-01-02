import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, User, Sparkles, TrendingUp, Info, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const mainNavItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: TrendingUp, label: 'Popular', path: '/?sort=top' },
];

const resourceItems = [
  { icon: Info, label: 'About ArtifAI', path: '/about' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path.includes('?') && location.search.includes(item.path.split('?')[1]));
            
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="my-4 border-t border-border/50" />

        {/* User Section */}
        {user && (
          <>
            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Your Space
            </div>
            <nav className="space-y-1 mb-4">
              <Link
                to="/profile"
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  location.pathname === '/profile'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <User className="w-5 h-5" />
                Profile
              </Link>
              <Link
                to="/create"
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  location.pathname === '/create'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <Sparkles className="w-5 h-5" />
                Create Art
              </Link>
            </nav>
            <div className="my-4 border-t border-border/50" />
          </>
        )}

        {/* Resources */}
        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Resources
        </div>
        <nav className="space-y-1">
          {resourceItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          © 2026 ArtifAI • Powered by Gemini
        </p>
      </div>
    </aside>
  );
}
