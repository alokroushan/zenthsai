import { useState, useEffect, useMemo } from 'react';
import { Loader2, Sparkles, TrendingUp, Clock, Flame, Star } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PostCard } from '@/components/posts/PostCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { sortPosts, getPersonalizedPosts } from '@/lib/feedAlgorithm';

type SortType = 'hot' | 'new' | 'top' | 'best';

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
    avatar_url?: string;
  } | null;
}

interface Vote {
  post_id: string;
  vote_type: number;
  user_id: string;
}

export default function Index() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<{ post_id: string }[]>([]);
  const [sortType, setSortType] = useState<SortType>('hot');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchVotes();
    fetchComments();

    const postsChannel = supabase
      .channel('posts-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => fetchPosts()
      )
      .subscribe();

    const votesChannel = supabase
      .channel('votes-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        () => fetchVotes()
      )
      .subscribe();

    const commentsChannel = supabase
      .channel('comments-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments' },
        () => fetchComments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(votesChannel);
      supabase.removeChannel(commentsChannel);
    };
  }, []);

  useEffect(() => {
    if (user) {
      const userVoteMap: Record<string, number> = {};
      votes.filter(v => v.user_id === user.id).forEach(v => {
        userVoteMap[v.post_id] = v.vote_type;
      });
      setUserVotes(userVoteMap);
    } else {
      setUserVotes({});
    }
  }, [votes, user]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, prompt, image_url, is_public, created_at, user_id')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const userIds = [...new Set((data || []).map(p => p.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, username, avatar_url')
        .in('user_id', userIds);
      
      const profilesMap = (profilesData || []).reduce((acc, p) => {
        acc[p.user_id] = p;
        return acc;
      }, {} as Record<string, any>);
      
      setPosts((data || []).map(post => ({
        ...post,
        profiles: profilesMap[post.user_id] || null
      })));
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVotes = async () => {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('post_id, vote_type, user_id');

      if (error) throw error;
      setVotes(data || []);
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('post_id');

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleVote = async (postId: string, voteType: number) => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    const existingVote = userVotes[postId];

    try {
      if (existingVote === voteType) {
        await supabase
          .from('votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else if (existingVote) {
        await supabase
          .from('votes')
          .update({ vote_type: voteType })
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase.from('votes').insert({
          post_id: postId,
          user_id: user.id,
          vote_type: voteType,
        });
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote');
    }
  };

  // Use the advanced feed algorithm
  const sortedPosts = useMemo(() => {
    let ranked = sortPosts(posts, votes, comments, sortType);
    
    // Apply personalization for logged-in users on "hot" sort
    if (user && sortType === 'hot') {
      ranked = getPersonalizedPosts(ranked, votes, user.id);
    }
    
    return ranked;
  }, [posts, votes, comments, sortType, user]);

  // Build comment counts map
  const commentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    comments.forEach((c) => {
      counts[c.post_id] = (counts[c.post_id] || 0) + 1;
    });
    return counts;
  }, [comments]);

  const getPostVotes = (postId: string) => {
    return votes.filter((v) => v.post_id === postId);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/50" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Powered by Google Gemini</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">
              Where <span className="gradient-text">AI Art</span> Comes Alive
            </h1>
            <p className="text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Generate stunning images with Gemini AI. Share, vote, and discover the best AI creations from our community.
            </p>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-10 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Sort Tabs with new "Best" option */}
      <div className="sticky top-16 z-40 glass-card border-t-0 rounded-none">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortType('hot')}
              className={cn(
                'gap-2 shrink-0',
                sortType === 'hot' && 'bg-primary/10 text-primary'
              )}
            >
              <Flame className="w-4 h-4" />
              Hot
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortType('best')}
              className={cn(
                'gap-2 shrink-0',
                sortType === 'best' && 'bg-primary/10 text-primary'
              )}
            >
              <Star className="w-4 h-4" />
              Best
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortType('new')}
              className={cn(
                'gap-2 shrink-0',
                sortType === 'new' && 'bg-primary/10 text-primary'
              )}
            >
              <Clock className="w-4 h-4" />
              New
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortType('top')}
              className={cn(
                'gap-2 shrink-0',
                sortType === 'top' && 'bg-primary/10 text-primary'
              )}
            >
              <TrendingUp className="w-4 h-4" />
              Top
            </Button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading amazing creations...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="w-12 h-12 mx-auto text-primary/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
              <p className="text-muted-foreground mb-6">
                Be the first to share your AI creation!
              </p>
            </div>
          ) : (
            sortedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                votes={getPostVotes(post.id)}
                userVote={userVotes[post.id]}
                commentCount={commentCounts[post.id] || 0}
                onVote={handleVote}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
