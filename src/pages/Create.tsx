import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Sparkles, Eye, EyeOff, Wand2, Upload, Image, X, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function CreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const editPostId = searchParams.get('edit');
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSourceImage(event.target?.result as string);
      setMode('edit');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (mode === 'edit' && !sourceImage) {
      toast.error('Please upload a source image for editing');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt,
          sourceImage: mode === 'edit' ? sourceImage : undefined,
          mode
        },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success(mode === 'edit' ? 'Image edited successfully!' : 'Image generated successfully!');
      } else {
        throw new Error('No image received');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      if (error.message?.includes('429')) {
        toast.error('Rate limit reached. Please wait a moment and try again.');
      } else if (error.message?.includes('402')) {
        toast.error('AI credits exhausted. Please add credits to continue.');
      } else {
        toast.error('Failed to generate image. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to create a post');
      navigate('/auth');
      return;
    }

    if (!title.trim() || !prompt.trim() || !generatedImage) {
      toast.error('Please fill in all fields and generate an image');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editPostId) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update({
            title: title.trim(),
            prompt: prompt.trim(),
            image_url: generatedImage,
            is_public: isPublic,
          })
          .eq('id', editPostId)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success('Post updated successfully!');
      } else {
        // Create new post
        const { error } = await supabase.from('posts').insert({
          user_id: user.id,
          title: title.trim(),
          prompt: prompt.trim(),
          image_url: generatedImage,
          is_public: isPublic,
        });

        if (error) throw error;
        toast.success('Post created successfully!');
      }
      
      navigate(isPublic ? '/' : '/profile');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSourceImage = () => {
    setSourceImage(null);
    setMode('generate');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
            <p className="text-muted-foreground mb-4">You need to sign in to create posts</p>
            <Button onClick={() => navigate('/auth')}>Sign In</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-card p-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {editPostId ? 'Edit Your Creation' : 'Create AI Art'}
              </h1>
              <p className="text-muted-foreground">
                Generate stunning images with Gemini AI
              </p>
            </div>
          </div>

          {/* Mode Selection */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'generate' | 'edit')} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Generate New
              </TabsTrigger>
              <TabsTrigger value="edit" className="gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="mt-4">
              <div className="space-y-4">
                <Label>Source Image</Label>
                {sourceImage ? (
                  <div className="relative">
                    <img
                      src={sourceImage}
                      alt="Source"
                      className="w-full max-h-64 object-contain rounded-xl border border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={clearSourceImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload an image to edit
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your creation a title..."
                className="glass-input"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">
                {mode === 'edit' ? 'Edit Instructions' : 'AI Prompt'}
              </Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === 'edit'
                    ? 'Describe how you want to edit this image...'
                    : 'Describe the image you want to generate...'
                }
                className="glass-input min-h-[120px] resize-none"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {prompt.length}/1000 characters
              </p>
            </div>

            <Button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGenerating || !prompt.trim() || (mode === 'edit' && !sourceImage)}
              className="w-full bg-gradient-to-r from-primary to-orange-400 hover:opacity-90 h-12 text-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {mode === 'edit' ? 'Editing...' : 'Generating...'}
                </>
              ) : (
                <>
                  {mode === 'edit' ? <Edit3 className="w-5 h-5 mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                  {mode === 'edit' ? 'Edit Image' : 'Generate Image'}
                </>
              )}
            </Button>

            {generatedImage && (
              <div className="space-y-4 animate-scale-in">
                <Label>Generated Image</Label>
                <div className="relative overflow-hidden rounded-xl border border-border">
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-auto"
                  />
                </div>
                
                {/* Regenerate with edit */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSourceImage(generatedImage);
                    setMode('edit');
                    setGeneratedImage(null);
                  }}
                  className="w-full"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit This Image
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
              <div className="flex items-center gap-3">
                {isPublic ? (
                  <Eye className="w-5 h-5 text-primary" />
                ) : (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">{isPublic ? 'Public' : 'Private'}</p>
                  <p className="text-sm text-muted-foreground">
                    {isPublic ? 'Everyone can see this post' : 'Only you can see this post'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !generatedImage || !title.trim()}
                className="flex-1 bg-gradient-to-r from-primary to-orange-400 hover:opacity-90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editPostId ? (
                  'Update Post'
                ) : (
                  'Share Creation'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
