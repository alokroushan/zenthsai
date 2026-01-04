import { MainLayout } from "@/components/layout/MainLayout";
import { CheckCircle, XCircle } from "lucide-react";

export default function Guidelines() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Community Guidelines</h1>
        
        <p className="text-muted-foreground mb-8">
          These guidelines help keep Zenth a welcoming place for everyone. Please read and follow them.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Do
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              Share original AI-generated artwork you've created
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              Provide constructive feedback and encouragement to other artists
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              Credit sources and inspirations when applicable
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              Report content that violates these guidelines
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              Respect the diversity of art styles and preferences
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Don't
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              Post NSFW or explicit content without proper tagging
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              Harass, bully, or attack other community members
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              Claim others' work as your own
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              Spam or excessively self-promote
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              Post content that promotes hate or discrimination
            </li>
          </ul>
        </section>

        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-2">Enforcement</h2>
          <p className="text-muted-foreground text-sm">
            Violations may result in content removal, temporary suspension, or permanent ban 
            depending on severity. We review all reports and apply these guidelines fairly.
          </p>
        </section>
      </div>
    </MainLayout>
  );
}
