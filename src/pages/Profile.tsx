import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, User, Image, Eye, EyeOff, Edit3, Trash2, Plus } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PostCard } from '@/components/posts/PostCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface VoteCount {
  post_id: string;
  upvotes: number;
  downvotes: number;
  total_score: number;
}

interface Profile {
  username: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]); // User's own votes only
  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([]); // Aggregated counts
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('public');
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPosts();
      fetchUserVotes();
      fetchVoteCounts();
      fetchCommentCounts();
    }
  }, [user]);

  // Derive userVotes map from votes array
  useEffect(() => {
    const userVoteMap: Record<string, number> = {};
    votes.forEach(v => {
      userVoteMap[v.post_id] = v.vote_type;
    });
    setUserVotes(userVoteMap);
  }, [votes]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, bio, created_at')
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, prompt, image_url, is_public, created_at, user_id')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data || []).map(post => ({
        ...post,
        profiles: profile ? { username: profile.username, avatar_url: profile.avatar_url } : null
      })));
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch only the current user's votes (RLS enforced)
  const fetchUserVotes = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('post_id, vote_type, user_id');
      if (error) throw error;
      setVotes(data || []);
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  // Fetch aggregated vote counts (public, no user_id exposed)
  const fetchVoteCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('post_vote_counts')
        .select('post_id, upvotes, downvotes, total_score');
      if (error) throw error;
      setVoteCounts(data || []);
    } catch (error) {
      console.error('Error fetching vote counts:', error);
    }
  };

  const fetchCommentCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('post_id');

      if (error) throw error;

      const counts: Record<string, number> = {};
      (data || []).forEach((comment) => {
        counts[comment.post_id] = (counts[comment.post_id] || 0) + 1;
      });
      setCommentCounts(counts);
    } catch (error) {
      console.error('Error fetching comment counts:', error);
    }
  };

  const handleVote = async (postId: string, voteType: number) => {
    if (!user) return;
    const existingVote = userVotes[postId];

    try {
      if (existingVote === voteType) {
        await supabase.from('votes').delete().eq('post_id', postId).eq('user_id', user.id);
      } else if (existingVote) {
        await supabase.from('votes').update({ vote_type: voteType }).eq('post_id', postId).eq('user_id', user.id);
      } else {
        await supabase.from('votes').insert({ post_id: postId, user_id: user.id, vote_type: voteType });
      }
      fetchUserVotes();
      fetchVoteCounts();
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote');
    }
  };

  const handleVisibilityChange = () => {
    fetchPosts();
  };

  const handleDeletePost = async () => {
    if (!deletePostId) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', deletePostId)
        .eq('user_id', user!.id);

      if (error) throw error;
      toast.success('Post deleted');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setDeletePostId(null);
    }
  };

  const getPostVoteCount = (postId: string) => {
    const vc = voteCounts.find(v => v.post_id === postId);
    return vc ? { upvotes: Number(vc.upvotes), downvotes: Number(vc.downvotes), total: Number(vc.total_score) } : { upvotes: 0, downvotes: 0, total: 0 };
  };

  const publicPosts = posts.filter(p => p.is_public);
  const privatePosts = posts.filter(p => !p.is_public);

  if (loading || !user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="glass-card p-8 mb-6 animate-fade-in">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary/30">
              <AvatarFallback className="text-3xl bg-secondary">
                {profile?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">
                {profile?.username || 'Loading...'}
              </h1>
              <p className="text-muted-foreground mb-4">{user.email}</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-primary" />
                  <span>{posts.length} posts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <span>{publicPosts.length} public</span>
                </div>
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                  <span>{privatePosts.length} private</span>
                </div>
              </div>
            </div>
            <Button asChild className="gap-2">
              <Link to="/create">
                <Plus className="w-4 h-4" />
                Create New
              </Link>
            </Button>
          </div>
        </div>

        {/* Posts Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="glass-card w-full mb-6">
            <TabsTrigger value="public" className="flex-1 gap-2">
              <Eye className="w-4 h-4" />
              Public ({publicPosts.length})
            </TabsTrigger>
            <TabsTrigger value="private" className="flex-1 gap-2">
              <EyeOff className="w-4 h-4" />
              Private ({privatePosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : publicPosts.length === 0 ? (
              <div className="text-center py-12 glass-card">
                <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No public posts yet</p>
              </div>
            ) : (
              publicPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  voteCount={getPostVoteCount(post.id)}
                  userVote={userVotes[post.id]}
                  commentCount={commentCounts[post.id] || 0}
                  onVote={handleVote}
                  onVisibilityChange={handleVisibilityChange}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="private" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : privatePosts.length === 0 ? (
              <div className="text-center py-12 glass-card">
                <EyeOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No private posts yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Private posts are only visible to you
                </p>
              </div>
            ) : (
              privatePosts.map((post) => (
                <div key={post.id} className="relative group">
                  <PostCard
                    post={post}
                    voteCount={getPostVoteCount(post.id)}
                    userVote={userVotes[post.id]}
                    commentCount={commentCounts[post.id] || 0}
                    onVote={handleVote}
                    onVisibilityChange={handleVisibilityChange}
                  />
                  {/* Edit/Delete overlay for private posts */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/create?edit=${post.id}`)}
                      className="gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeletePostId(post.id)}
                      className="gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post and all its comments will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
