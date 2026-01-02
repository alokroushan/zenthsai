import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ArrowBigUp, ArrowBigDown, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommentSection } from '@/components/comments/CommentSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  prompt: string;
  image_url: string;
  is_public: boolean;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
  } | null;
}

interface Vote {
  vote_type: number;
  user_id: string;
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchVotes();
    }
  }, [id]);

  useEffect(() => {
    if (user && votes.length > 0) {
      const myVote = votes.find(v => v.user_id === user.id);
      setUserVote(myVote?.vote_type || null);
    }
  }, [votes, user]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, prompt, image_url, is_public, created_at, user_id')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (!data.is_public && data.user_id !== user?.id) {
        toast.error('This post is private');
        navigate('/');
        return;
      }
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', data.user_id)
        .single();
      
      setPost({ ...data, profiles: profileData });
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Post not found');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVotes = async () => {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('vote_type, user_id')
        .eq('post_id', id);

      if (error) throw error;
      setVotes(data || []);
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const handleVote = async (voteType: number) => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    try {
      if (userVote === voteType) {
        await supabase.from('votes').delete().eq('post_id', id).eq('user_id', user.id);
        setUserVote(null);
        setVotes(votes.filter(v => v.user_id !== user.id));
      } else if (userVote) {
        await supabase.from('votes').update({ vote_type: voteType }).eq('post_id', id).eq('user_id', user.id);
        setUserVote(voteType);
        setVotes(votes.map(v => v.user_id === user.id ? { ...v, vote_type: voteType } : v));
      } else {
        await supabase.from('votes').insert({ post_id: id, user_id: user.id, vote_type: voteType });
        setUserVote(voteType);
        setVotes([...votes, { user_id: user.id, vote_type: voteType }]);
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote');
    }
  };

  const totalVotes = votes.reduce((sum, v) => sum + v.vote_type, 0);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!post) return null;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to feed
        </Link>

        <div className="glass-card overflow-hidden animate-fade-in">
          <div className="flex">
            {/* Vote Column */}
            <div className="flex flex-col items-center gap-1 p-4 bg-secondary/30">
              <button
                onClick={() => handleVote(1)}
                className={cn('vote-button', userVote === 1 ? 'vote-up-active' : 'vote-up')}
                disabled={!user}
              >
                <ArrowBigUp className="w-8 h-8" />
              </button>
              <span className={cn(
                'text-lg font-bold',
                totalVotes > 0 ? 'text-upvote' : totalVotes < 0 ? 'text-downvote' : 'text-muted-foreground'
              )}>
                {totalVotes}
              </span>
              <button
                onClick={() => handleVote(-1)}
                className={cn('vote-button', userVote === -1 ? 'vote-down-active' : 'vote-down')}
                disabled={!user}
              >
                <ArrowBigDown className="w-8 h-8" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-secondary">
                    {post.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.profiles?.username || 'anonymous'}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </p>
                </div>
                {!post.is_public && (
                  <Badge variant="outline" className="ml-auto">
                    <EyeOff className="w-3 h-3 mr-1" />
                    Private
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

              <div className="relative overflow-hidden rounded-xl mb-6">
                <img src={post.image_url} alt={post.title} className="w-full h-auto" />
              </div>

              {/* Only show prompt to the post owner */}
              {user?.id === post.user_id && (
                <div className="p-4 rounded-xl bg-secondary/30 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Your prompt:</p>
                  <p className="italic">"{post.prompt}"</p>
                </div>
              )}

              <CommentSection postId={post.id} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
