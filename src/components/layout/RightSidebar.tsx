import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles, Palette, Camera, Brush, Wand2 } from 'lucide-react';

const popularStyles = [
  { name: 'Digital Art', icon: Palette, count: '2.4M' },
  { name: 'Photography', icon: Camera, count: '1.8M' },
  { name: 'Illustrations', icon: Brush, count: '956K' },
  { name: 'Abstract', icon: Wand2, count: '742K' },
  { name: 'AI Generated', icon: Sparkles, count: '3.1M' },
];

export function RightSidebar() {
  return (
    <aside className="hidden xl:block w-80 h-[calc(100vh-3.5rem)] sticky top-14 p-4 overflow-y-auto">
      {/* Popular Styles */}
      <div className="glass-card p-4 mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Popular Styles
        </h3>
        <div className="space-y-1">
          {popularStyles.map((style) => (
            <Link
              key={style.name}
              to={`/?style=${style.name.toLowerCase().replace(' ', '-')}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors group"
            >
              <Avatar className="w-8 h-8 bg-secondary">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-orange-400/20">
                  <style.icon className="w-4 h-4 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium group-hover:text-primary transition-colors">
                  {style.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {style.count} creations
                </p>
              </div>
            </Link>
          ))}
        </div>
        <button className="w-full mt-3 text-sm text-primary hover:underline text-left px-2">
          See more
        </button>
      </div>

      {/* Footer Links */}
      <div className="px-2 text-xs text-muted-foreground space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <Link to="/rules" className="hover:underline">Rules</Link>
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:underline">User Agreement</Link>
          <Link to="/accessibility" className="hover:underline">Accessibility</Link>
        </div>
        <p className="pt-1">Zenth, Inc. © 2026. All rights reserved.</p>
      </div>
    </aside>
  );
}
