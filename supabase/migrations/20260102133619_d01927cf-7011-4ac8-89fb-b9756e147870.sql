-- Add constraint for comment content length validation
ALTER TABLE public.comments ADD CONSTRAINT content_length_check 
CHECK (length(content) <= 500 AND length(content) > 0);

-- Drop and recreate the handle_new_user function with proper validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username TEXT;
BEGIN
  -- Get username from metadata or generate default
  v_username := COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::text, 8));
  
  -- Validate length (3-30 characters)
  IF length(v_username) < 3 OR length(v_username) > 30 THEN
    v_username := 'user_' || LEFT(NEW.id::text, 8);
  END IF;
  
  -- Remove dangerous characters (only allow alphanumeric, underscore, hyphen)
  v_username := regexp_replace(v_username, '[^a-zA-Z0-9_-]', '', 'g');
  
  -- Ensure username is not empty after sanitization
  IF length(v_username) < 3 THEN
    v_username := 'user_' || LEFT(NEW.id::text, 8);
  END IF;
  
  -- Insert profile with conflict handling for duplicate usernames
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, v_username)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Handle duplicate username by appending random suffix
    v_username := 'user_' || LEFT(NEW.id::text, 8) || '_' || floor(random() * 1000)::text;
    INSERT INTO public.profiles (user_id, username)
    VALUES (NEW.id, v_username)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$;