-- Create chat messages table for live community chat
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can read chat messages
CREATE POLICY "Chat messages are viewable by everyone" 
ON public.chat_messages 
FOR SELECT 
USING (true);

-- Authenticated users can insert their own messages
CREATE POLICY "Authenticated users can send chat messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete their own messages" 
ON public.chat_messages 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Create shorts/videos table
CREATE TABLE public.shorts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shorts ENABLE ROW LEVEL SECURITY;

-- Anyone can view public shorts
CREATE POLICY "Shorts are viewable by everyone" 
ON public.shorts 
FOR SELECT 
USING (true);

-- Authenticated users can create shorts
CREATE POLICY "Authenticated users can create shorts" 
ON public.shorts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own shorts
CREATE POLICY "Users can update their own shorts" 
ON public.shorts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own shorts
CREATE POLICY "Users can delete their own shorts" 
ON public.shorts 
FOR DELETE 
USING (auth.uid() = user_id);