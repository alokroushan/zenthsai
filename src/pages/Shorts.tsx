import { useState, useEffect, useRef, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  VolumeX, 
  Play,
  Home,
  Loader2,
  Sparkles,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Short {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  views: number;
  created_at: string;
  profile?: {
    username: string;
    avatar_url: string | null;
  };
}

const demoShorts: Short[] = [
  {
    id: '1',
    user_id: 'demo',
    title: 'AI Generated Sunset',
    description: 'Beautiful sunset generated with Veo 3',
    video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail_url: null,
    views: 1234,
    created_at: new Date().toISOString(),
    profile: { username: 'ai_creator', avatar_url: null },
  },
  {
    id: '2',
    user_id: 'demo',
    title: 'Abstract Motion Art',
    description: 'Flowing abstract patterns created with AI',
    video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail_url: null,
    views: 5678,
    created_at: new Date().toISOString(),
    profile: { username: 'motion_artist', avatar_url: null },
  },
  {
    id: '3',
    user_id: 'demo',
    title: 'Digital Dreams',
    description: 'Surreal dreamscape animation',
    video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail_url: null,
    views: 9012,
    created_at: new Date().toISOString(),
    profile: { username: 'dream_maker', avatar_url: null },
  },
];

function ShortVideo({ 
  short, 
  isActive, 
  isMuted, 
  onToggleMute 
}: { 
  short: Short; 
  isActive: boolean; 
  isMuted: boolean;
  onToggleMute: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isActive) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={short.video_url}
        className="w-full h-full object-contain"
        loop
        playsInline
        muted={isMuted}
        onClick={togglePlay}
      />

      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </button>
      )}

      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">
        <button 
          onClick={() => setLiked(!liked)}
          className="flex flex-col items-center gap-1"
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            liked ? "bg-red-500" : "bg-white/10 backdrop-blur-sm"
          )}>
            <Heart className={cn("w-6 h-6", liked ? "fill-white text-white" : "text-white")} />
          </div>
          <span className="text-white text-xs font-medium">
            {Math.floor(short.views / 10)}
          </span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">
            {Math.floor(short.views / 50)}
          </span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">Share</span>
        </button>

        <button 
          onClick={onToggleMute}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      <div className="absolute left-4 right-20 bottom-8">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-10 h-10 border-2 border-white">
            <AvatarImage src={short.profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {short.profile?.username?.charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <span className="text-white font-semibold">
            @{short.profile?.username || 'unknown'}
          </span>
          <Button size="sm" variant="outline" className="h-7 text-xs border-white/50 text-white bg-transparent hover:bg-white/10">
            Follow
          </Button>
        </div>
        <h3 className="text-white font-medium mb-1">{short.title}</h3>
        {short.description && (
          <p className="text-white/80 text-sm line-clamp-2">{short.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2 text-white/60 text-xs">
          <Sparkles className="w-3 h-3" />
          <span>Generated with Veo 3</span>
        </div>
      </div>
    </div>
  );
}

export default function Shorts() {
  const [shorts, setShorts] = useState<Short[]>(demoShorts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchShorts();
  }, []);

  const fetchShorts = async () => {
    try {
      const { data, error } = await supabase
        .from('shorts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        const userIds = [...new Set(data.map((s) => s.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, username, avatar_url')
          .in('user_id', userIds);

        const profilesMap = (profilesData || []).reduce((acc, p) => {
          acc[p.user_id] = p;
          return acc;
        }, {} as Record<string, any>);

        setShorts(
          data.map((short) => ({
            ...short,
            profile: profilesMap[short.user_id],
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching shorts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, shorts.length - 1));
  }, [shorts.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;
      const endY = e.changedTouches[0].clientY;
      const diff = startY - endY;

      if (Math.abs(diff) > 50) {
        if (diff > 0) goToNext();
        else goToPrev();
      }
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 50) {
        if (e.deltaY > 0) goToNext();
        else goToPrev();
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [goToNext, goToPrev]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') goToNext();
      else if (e.key === 'ArrowUp' || e.key === 'k') goToPrev();
      else if (e.key === 'm') setIsMuted((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-black overflow-hidden" ref={containerRef}>
      <Link
        to="/"
        className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <Home className="w-5 h-5 text-white" />
      </Link>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-30"
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === shorts.length - 1}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-30"
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1">
        {shorts.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "w-1 h-4 rounded-full transition-colors",
              idx === currentIndex ? "bg-white" : "bg-white/30"
            )}
          />
        ))}
      </div>

      <div className="relative h-full w-full max-w-md mx-auto">
        {shorts.map((short, idx) => (
          <div
            key={short.id}
            className={cn(
              "absolute inset-0 transition-transform duration-300",
              idx === currentIndex
                ? "translate-y-0"
                : idx < currentIndex
                ? "-translate-y-full"
                : "translate-y-full"
            )}
          >
            <ShortVideo
              short={short}
              isActive={idx === currentIndex}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted((prev) => !prev)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}