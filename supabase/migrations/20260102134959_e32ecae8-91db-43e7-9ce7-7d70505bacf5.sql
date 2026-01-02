-- Fix votes privacy exposure by restricting individual vote access
-- and creating a view for aggregated counts

-- 1. Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Votes are viewable by everyone" ON public.votes;

-- 2. Create new policy allowing users to only see their own votes
CREATE POLICY "Users can view their own votes"
  ON public.votes
  FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Create a view for aggregated vote counts per post (no user_id exposed)
CREATE OR REPLACE VIEW public.post_vote_counts AS
SELECT 
  post_id,
  COUNT(*) FILTER (WHERE vote_type = 1) AS upvotes,
  COUNT(*) FILTER (WHERE vote_type = -1) AS downvotes,
  COALESCE(SUM(vote_type), 0) AS total_score
FROM public.votes
GROUP BY post_id;

-- 4. Grant access to the view for all users
GRANT SELECT ON public.post_vote_counts TO anon, authenticated;