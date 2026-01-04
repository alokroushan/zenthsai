import { MainLayout } from "@/components/layout/MainLayout";
import { Accessibility as AccessibilityIcon, Eye, Keyboard, Volume2 } from "lucide-react";

export default function Accessibility() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <AccessibilityIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Accessibility Statement</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Zenth is committed to ensuring digital accessibility for people with disabilities. 
          We continually improve the user experience for everyone.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Our Commitment</h2>
          <p className="text-muted-foreground">
            We strive to meet WCAG 2.1 Level AA standards and are constantly working to 
            improve accessibility across our platform.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border">
            <Eye className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Visual</h3>
            <ul className="text-muted-foreground text-sm space-y-1">
              <li>• High contrast color schemes</li>
              <li>• Resizable text support</li>
              <li>• Alt text for images</li>
              <li>• Screen reader compatibility</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <Keyboard className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Motor</h3>
            <ul className="text-muted-foreground text-sm space-y-1">
              <li>• Full keyboard navigation</li>
              <li>• Skip navigation links</li>
              <li>• Focus indicators</li>
              <li>• Large click targets</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <Volume2 className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Auditory</h3>
            <ul className="text-muted-foreground text-sm space-y-1">
              <li>• No audio-only content</li>
              <li>• Visual indicators for alerts</li>
              <li>• Captions for video content</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <AccessibilityIcon className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Cognitive</h3>
            <ul className="text-muted-foreground text-sm space-y-1">
              <li>• Clear, simple language</li>
              <li>• Consistent navigation</li>
              <li>• Error prevention & recovery</li>
              <li>• Predictable interactions</li>
            </ul>
          </div>
        </div>

        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-3">Feedback</h2>
          <p className="text-muted-foreground text-sm mb-3">
            We welcome your feedback on the accessibility of Zenth. If you encounter 
            accessibility barriers or have suggestions for improvement, please contact us.
          </p>
          <a
            href="mailto:accessibility@zenth.art"
            className="text-primary hover:underline text-sm"
          >
            accessibility@zenth.art
          </a>
        </section>
      </div>
    </MainLayout>
  );
}
