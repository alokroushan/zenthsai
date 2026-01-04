import { MainLayout } from "@/components/layout/MainLayout";
import { BookOpen } from "lucide-react";

const rules = [
  {
    number: 1,
    title: "Be Respectful",
    description: "Treat all community members with respect. No harassment, bullying, or personal attacks.",
  },
  {
    number: 2,
    title: "Original Content Only",
    description: "Only post AI art that you've created. Don't claim others' work as your own.",
  },
  {
    number: 3,
    title: "Appropriate Content",
    description: "Follow our content policy. Tag sensitive content appropriately and never post prohibited content.",
  },
  {
    number: 4,
    title: "No Spam",
    description: "Don't spam posts, comments, or messages. Quality over quantity.",
  },
  {
    number: 5,
    title: "Constructive Feedback",
    description: "When commenting on others' work, be constructive and helpful. Criticism should be respectful.",
  },
  {
    number: 6,
    title: "Report Violations",
    description: "Help keep the community safe by reporting content that violates these rules.",
  },
  {
    number: 7,
    title: "Follow Platform Guidelines",
    description: "Adhere to our Terms of Service, Privacy Policy, and Content Policy at all times.",
  },
];

export default function Rules() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Community Rules</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          These rules help maintain a positive and creative community for everyone.
        </p>

        <div className="space-y-4">
          {rules.map((rule) => (
            <div
              key={rule.number}
              className="bg-card rounded-lg p-5 border border-border flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">{rule.number}</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{rule.title}</h3>
                <p className="text-muted-foreground text-sm">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted/30 rounded-lg text-center">
          <p className="text-muted-foreground text-sm">
            Breaking these rules may result in content removal or account suspension.
            See our{" "}
            <a href="/content-policy" className="text-primary hover:underline">
              Content Policy
            </a>{" "}
            for details.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
