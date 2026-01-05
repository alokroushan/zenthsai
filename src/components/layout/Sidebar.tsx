import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, User, Sparkles, TrendingUp, Info, HelpCircle, ChevronUp, Newspaper, Book, Code, MessageCircle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const mainNavItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: TrendingUp, label: 'Popular', path: '/?sort=top' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Play, label: 'Shorts', path: '/shorts' },
  { icon: MessageCircle, label: 'Chat', path: '/chat' },
];

const resourceItems = [
  { icon: Info, label: 'About Zenth', path: '/about' },
  { icon: Book, label: 'Guidelines', path: '/guidelines' },
  { icon: Code, label: 'API', path: '/api' },
  { icon: Newspaper, label: 'Blog', path: '/blog' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [resourcesOpen, setResourcesOpen] = useState(true);

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-3.5rem)] sticky top-14 border-r border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto py-3 px-3">
        {/* Main Navigation */}
        <nav className="space-y-0.5">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path.includes('?') && location.search.includes(item.path.split('?')[1]));
            
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="my-3 border-t border-border/50" />

        {/* User Section */}
        {user && (
          <>
            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Your Space
            </div>
            <nav className="space-y-0.5 mb-3">
              <Link
                to="/profile"
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  location.pathname === '/profile'
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                )}
              >
                <User className="w-5 h-5" />
                Profile
              </Link>
              <Link
                to="/create"
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  location.pathname === '/create'
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                )}
              >
                <Sparkles className="w-5 h-5" />
                Create Art
              </Link>
            </nav>
            <div className="my-3 border-t border-border/50" />
          </>
        )}

        {/* Resources - Collapsible */}
        <Collapsible open={resourcesOpen} onOpenChange={setResourcesOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
            Resources
            <ChevronUp className={cn(
              "w-4 h-4 transition-transform duration-200",
              resourcesOpen ? "" : "rotate-180"
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <nav className="space-y-0.5">
              {resourceItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all duration-200"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border/50">
        <div className="text-xs text-muted-foreground space-y-1 px-2">
          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/content-policy" className="hover:underline">Content Policy</Link>
          </div>
          <p className="pt-1">© 2026 Zenth</p>
        </div>
      </div>
    </aside>
  );
}
