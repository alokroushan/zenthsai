import { MainLayout } from "@/components/layout/MainLayout";
import { Sparkles, Users, Zap, Shield } from "lucide-react";

export default function About() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">About Zenth</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Zenth is a community-driven platform for AI-generated art enthusiasts. 
            Share your creations, discover amazing artwork, and connect with fellow artists.
          </p>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="bg-card rounded-lg p-6 border border-border">
              <Sparkles className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered Creation</h3>
              <p className="text-muted-foreground text-sm">
                Generate stunning artwork using cutting-edge AI models directly on our platform.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Vibrant Community</h3>
              <p className="text-muted-foreground text-sm">
                Join thousands of artists sharing, voting, and discussing AI art.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <Zap className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Instant Sharing</h3>
              <p className="text-muted-foreground text-sm">
                Share your creations instantly and get feedback from the community.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Safe & Respectful</h3>
              <p className="text-muted-foreground text-sm">
                We maintain a respectful environment with clear community guidelines.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            We believe AI art is a new frontier of creative expression. Zenth aims to be the 
            premier destination for artists and enthusiasts to explore, create, and share 
            AI-generated artwork in a supportive community environment.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            Have questions or feedback? Reach out to us at{" "}
            <a href="mailto:hello@zenth.art" className="text-primary hover:underline">
              hello@zenth.art
            </a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
