-- Fix the view to use SECURITY INVOKER instead of SECURITY DEFINER
DROP VIEW IF EXISTS public.post_vote_counts;

CREATE VIEW public.post_vote_counts
WITH (security_invoker = true)
AS
SELECT 
  post_id,
  COUNT(*) FILTER (WHERE vote_type = 1) AS upvotes,
  COUNT(*) FILTER (WHERE vote_type = -1) AS downvotes,
  COALESCE(SUM(vote_type), 0) AS total_score
FROM public.votes
GROUP BY post_id;

-- Grant access to the view for all users
GRANT SELECT ON public.post_vote_counts TO anon, authenticated;