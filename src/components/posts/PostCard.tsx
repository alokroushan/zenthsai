import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Eye, EyeOff, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    prompt: string;
    image_url: string;
    is_public: boolean;
    created_at: string;
    user_id: string;
    profiles?: {
      username: string;
      avatar_url?: string;
    };
  };
  votes: { vote_type: number }[];
  userVote?: number;
  commentCount: number;
  onVote: (postId: string, voteType: number) => void;
  onVisibilityChange?: (postId: string, isPublic: boolean) => void;
}

export function PostCard({ post, votes, userVote, commentCount, onVote, onVisibilityChange }: PostCardProps) {
  const { user } = useAuth();
  const [isChangingVisibility, setIsChangingVisibility] = useState(false);

  const totalVotes = votes.reduce((sum, v) => sum + v.vote_type, 0);
  const isOwner = user?.id === post.user_id;

  const handleVisibilityToggle = async () => {
    if (!isOwner) return;
    
    setIsChangingVisibility(true);
    try {
      const { error } = await supabase
        .from('posts')
        .update({ is_public: !post.is_public })
        .eq('id', post.id);

      if (error) throw error;
      
      onVisibilityChange?.(post.id, !post.is_public);
      toast.success(`Post is now ${!post.is_public ? 'public' : 'private'}`);
    } catch (error) {
      toast.error('Failed to update visibility');
    } finally {
      setIsChangingVisibility(false);
    }
  };

  return (
    <article className="glass-card overflow-hidden animate-fade-in hover:border-primary/30 transition-all duration-300 group">
      <div className="flex">
        {/* Vote Column */}
        <div className="flex flex-col items-center gap-1 p-3 bg-secondary/30">
          <button
            onClick={() => user && onVote(post.id, 1)}
            className={cn(
              'vote-button',
              userVote === 1 ? 'vote-up-active' : 'vote-up'
            )}
            disabled={!user}
          >
            <ArrowBigUp className="w-6 h-6" />
          </button>
          <span className={cn(
            'text-sm font-bold',
            totalVotes > 0 ? 'text-upvote' : totalVotes < 0 ? 'text-downvote' : 'text-muted-foreground'
          )}>
            {totalVotes}
          </span>
          <button
            onClick={() => user && onVote(post.id, -1)}
            className={cn(
              'vote-button',
              userVote === -1 ? 'vote-down-active' : 'vote-down'
            )}
            disabled={!user}
          >
            <ArrowBigDown className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="p-4 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs bg-secondary">
                  {post.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">
                {post.profiles?.username || 'anonymous'}
              </span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
              {!post.is_public && (
                <Badge variant="outline" className="text-xs">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Private
                </Badge>
              )}
            </div>
            
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card">
                  <DropdownMenuItem
                    onClick={handleVisibilityToggle}
                    disabled={isChangingVisibility}
                    className="cursor-pointer"
                  >
                    {post.is_public ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Make Private
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Make Public
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Title */}
          <Link to={`/post/${post.id}`} className="block px-4">
            <h2 className="text-lg font-semibold hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>

          {/* Image */}
          <Link to={`/post/${post.id}`} className="block p-4">
            <div className="relative overflow-hidden rounded-lg aspect-video bg-secondary/50">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </Link>

          {/* Footer */}
          <div className="px-4 pb-4 flex items-center gap-4">
            <Link
              to={`/post/${post.id}`}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
