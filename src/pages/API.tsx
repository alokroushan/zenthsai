import { MainLayout } from "@/components/layout/MainLayout";
import { Code, Key, BookOpen, Terminal } from "lucide-react";

export default function API() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">API Documentation</h1>
        
        <p className="text-muted-foreground mb-8">
          Build amazing applications with the Zenth API. Access our AI art generation 
          and community features programmatically.
        </p>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border">
            <Key className="h-8 w-8 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Authentication</h3>
            <p className="text-muted-foreground text-sm">
              Secure API access using OAuth 2.0 and API keys.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <Code className="h-8 w-8 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">REST API</h3>
            <p className="text-muted-foreground text-sm">
              Full RESTful API for all platform features.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <Terminal className="h-8 w-8 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">SDKs</h3>
            <p className="text-muted-foreground text-sm">
              Official SDKs for Python, JavaScript, and more.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <BookOpen className="h-8 w-8 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Examples</h3>
            <p className="text-muted-foreground text-sm">
              Code examples and tutorials to get started quickly.
            </p>
          </div>
        </div>

        <section className="bg-card rounded-lg p-6 border border-border mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Quick Start</h2>
          <pre className="bg-background rounded p-4 overflow-x-auto text-sm">
            <code className="text-muted-foreground">
{`# Install the Zenth SDK
npm install @zenth/sdk

# Generate an image
import { Zenth } from '@zenth/sdk';

const zenth = new Zenth({ apiKey: 'your-api-key' });
const image = await zenth.generate({
  prompt: 'A mystical forest at sunset'
});`}
            </code>
          </pre>
        </section>

        <p className="text-muted-foreground text-center">
          API access coming soon.{" "}
          <a href="mailto:api@zenth.art" className="text-primary hover:underline">
            Contact us
          </a>{" "}
          for early access.
        </p>
      </div>
    </MainLayout>
  );
}
