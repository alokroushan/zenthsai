// Advanced Feed Ranking Algorithm
// Inspired by Reddit's Hot algorithm with engagement weighting

export interface ScoredPost {
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
  } | null;
  score: number;
  hotScore: number;
  engagementScore: number;
  voteCount: number;
  commentCount: number;
  wilsonScore?: number;
}

interface PostData {
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
  } | null;
  [key: string]: any;
}

interface VoteData {
  post_id: string;
  vote_type: number;
  user_id: string;
}

interface VoteCountData {
  post_id: string;
  upvotes: number;
  downvotes: number;
  total_score: number;
}

interface CommentData {
  post_id: string;
}

// Calculate the "hot" score using a modified Wilson score
// This balances new content with engagement
export function calculateHotScore(
  upvotes: number,
  downvotes: number,
  comments: number,
  createdAt: Date
): number {
  const score = upvotes - downvotes;
  const order = Math.log10(Math.max(Math.abs(score), 1));
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
  
  // Time decay factor - posts lose relevance over time
  const seconds = (Date.now() - createdAt.getTime()) / 1000;
  const hours = seconds / 3600;
  
  // Engagement boost from comments (comments are valuable engagement)
  const commentBoost = Math.log10(Math.max(comments + 1, 1)) * 0.5;
  
  // The hot score formula
  // Higher scores = more visible
  // New posts get a boost, engagement amplifies visibility
  const hotScore = (sign * order + commentBoost) - (hours / 12);
  
  return hotScore;
}

// Calculate engagement score (pure engagement without time decay)
export function calculateEngagementScore(
  upvotes: number,
  downvotes: number,
  comments: number
): number {
  // Upvotes are worth 1 point
  // Downvotes subtract 1 point
  // Comments are worth 2 points (more valuable engagement)
  return upvotes - downvotes + (comments * 2);
}

// Wilson score confidence interval for "best" ranking
// This helps surface content that is likely to be good
// even with fewer votes
export function calculateWilsonScore(
  upvotes: number,
  totalVotes: number
): number {
  if (totalVotes === 0) return 0;
  
  const z = 1.96; // 95% confidence
  const p = upvotes / totalVotes;
  
  const left = p + (z * z) / (2 * totalVotes);
  const right = z * Math.sqrt((p * (1 - p) + (z * z) / (4 * totalVotes)) / totalVotes);
  const under = 1 + (z * z) / totalVotes;
  
  return (left - right) / under;
}

// Main sorting function - now uses aggregated vote counts
export function sortPosts(
  posts: PostData[],
  voteCounts: VoteCountData[],
  comments: CommentData[],
  sortType: 'hot' | 'new' | 'top' | 'best'
): ScoredPost[] {
  // Build vote counts map
  const votesByPost: Record<string, { up: number; down: number }> = {};
  const commentsByPost: Record<string, number> = {};
  
  voteCounts.forEach((vc) => {
    votesByPost[vc.post_id] = { 
      up: Number(vc.upvotes) || 0, 
      down: Number(vc.downvotes) || 0 
    };
  });
  
  comments.forEach((comment) => {
    commentsByPost[comment.post_id] = (commentsByPost[comment.post_id] || 0) + 1;
  });
  
  // Score each post
  const scoredPosts: ScoredPost[] = posts.map((post) => {
    const postVotes = votesByPost[post.id] || { up: 0, down: 0 };
    const postComments = commentsByPost[post.id] || 0;
    const createdAt = new Date(post.created_at);
    
    const score = postVotes.up - postVotes.down;
    const totalVotes = postVotes.up + postVotes.down;
    
    const hotScore = calculateHotScore(
      postVotes.up,
      postVotes.down,
      postComments,
      createdAt
    );
    
    const engagementScore = calculateEngagementScore(
      postVotes.up,
      postVotes.down,
      postComments
    );
    
    const wilsonScore = calculateWilsonScore(postVotes.up, totalVotes);
    
    return {
      ...post,
      score,
      hotScore,
      engagementScore,
      wilsonScore,
      voteCount: score,
      commentCount: postComments,
    };
  });
  
  // Sort based on type
  switch (sortType) {
    case 'new':
      return scoredPosts.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    
    case 'top':
      // Sort by pure vote score
      return scoredPosts.sort((a, b) => b.score - a.score);
    
    case 'best':
      // Sort by Wilson score (confidence in quality)
      return scoredPosts.sort((a, b) => (b as any).wilsonScore - (a as any).wilsonScore);
    
    case 'hot':
    default:
      // Sort by hot score (engagement + recency)
      return scoredPosts.sort((a, b) => b.hotScore - a.hotScore);
  }
}

// Get posts that might interest a user based on their voting history
export function getPersonalizedPosts(
  posts: ScoredPost[],
  userVotes: VoteData[],
  userId: string
): ScoredPost[] {
  // Get posts the user has upvoted
  const upvotedPostIds = new Set(
    userVotes
      .filter(v => v.user_id === userId && v.vote_type === 1)
      .map(v => v.post_id)
  );
  
  // Boost posts from creators the user has upvoted before
  const likedCreators = new Set<string>();
  posts.forEach(post => {
    if (upvotedPostIds.has(post.id)) {
      likedCreators.add(post.user_id);
    }
  });
  
  // Apply personalization boost
  return posts.map(post => {
    let personalBoost = 0;
    
    // Boost posts from liked creators
    if (likedCreators.has(post.user_id)) {
      personalBoost += 0.5;
    }
    
    return {
      ...post,
      hotScore: post.hotScore + personalBoost,
    };
  }).sort((a, b) => b.hotScore - a.hotScore);
}
