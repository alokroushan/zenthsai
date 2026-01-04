import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PostCard } from "@/components/posts/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface Post {
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
}

export default function Explore() {
  const [searchParams] = useSearchParams();
  const styleFilter = searchParams.get("style");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [styleFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from("posts")
      .select(`*, profiles:user_id(username, avatar_url)`)
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (styleFilter) {
      query = query.ilike("prompt", `%${styleFilter}%`);
    }

    const { data, error } = await query;
    if (!error && data) {
      setPosts(data as unknown as Post[]);
    }
    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Explore</h1>
          {styleFilter && (
            <p className="text-muted-foreground mt-1">
              Showing posts with style: <span className="text-primary">{styleFilter}</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No posts found{styleFilter ? ` for style "${styleFilter}"` : ""}.
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                voteCount={{ upvotes: 0, downvotes: 0, total: 0 }}
                userVote={undefined}
                commentCount={0}
                onVote={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
