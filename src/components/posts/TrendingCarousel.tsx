import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TrendingPost {
  id: string;
  title: string;
  image_url: string;
  profiles?: {
    username: string;
  } | null;
}

interface TrendingCarouselProps {
  posts: TrendingPost[];
}

export function TrendingCarousel({ posts }: TrendingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    ref?.addEventListener('scroll', checkScroll);
    return () => ref?.removeEventListener('scroll', checkScroll);
  }, [posts]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (posts.length === 0) return null;

  return (
    <div className="relative mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        🔥 Trending Now
      </h2>
      
      <div className="relative group">
        {/* Scroll Buttons */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        
        {canScrollRight && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {posts.map((post, index) => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className={cn(
                'flex-shrink-0 relative group/card rounded-xl overflow-hidden',
                'w-[280px] h-[180px]',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                  {post.title}
                </h3>
                <p className="text-white/70 text-xs">
                  by {post.profiles?.username || 'anonymous'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
