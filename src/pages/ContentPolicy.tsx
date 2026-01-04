import { MainLayout } from "@/components/layout/MainLayout";
import { AlertTriangle, Ban, Shield } from "lucide-react";

export default function ContentPolicy() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Content Policy</h1>
        
        <p className="text-muted-foreground mb-8">
          This policy outlines what content is allowed and prohibited on Zenth.
        </p>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Ban className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-semibold text-foreground">Prohibited Content</h2>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <ul className="space-y-3 text-muted-foreground">
              <li>• Content depicting minors in inappropriate situations</li>
              <li>• Non-consensual intimate imagery</li>
              <li>• Content promoting violence or terrorism</li>
              <li>• Hate speech targeting protected groups</li>
              <li>• Content that infringes on intellectual property rights</li>
              <li>• Spam, scams, or misleading content</li>
              <li>• Content that violates local laws</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-foreground">Sensitive Content</h2>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted-foreground mb-3">
              The following content requires appropriate tagging (NSFW, etc.):
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Adult or mature content</li>
              <li>• Graphic violence</li>
              <li>• Controversial or political imagery</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-semibold text-foreground">Enforcement</h2>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted-foreground">
              Violations are handled based on severity:
            </p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">First offense:</strong> Content removal + warning</li>
              <li><strong className="text-foreground">Second offense:</strong> Temporary suspension (7 days)</li>
              <li><strong className="text-foreground">Third offense:</strong> Permanent ban</li>
              <li><strong className="text-foreground">Severe violations:</strong> Immediate permanent ban</li>
            </ul>
          </div>
        </section>

        <section className="bg-primary/10 rounded-lg p-6 border border-primary/30">
          <h3 className="font-semibold text-foreground mb-2">Appeal Process</h3>
          <p className="text-muted-foreground text-sm">
            If you believe your content was removed in error, you can appeal by contacting{" "}
            <a href="mailto:appeals@zenth.art" className="text-primary hover:underline">
              appeals@zenth.art
            </a>
          </p>
        </section>
      </div>
    </MainLayout>
  );
}
