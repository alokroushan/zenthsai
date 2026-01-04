import { MainLayout } from "@/components/layout/MainLayout";
import { Calendar, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Welcome to Zenth",
    excerpt: "We're excited to launch Zenth, a new platform for AI art enthusiasts to share and discover amazing creations.",
    date: "2025-01-01",
    category: "Announcement",
  },
  {
    id: 2,
    title: "Tips for Better AI Art Prompts",
    excerpt: "Learn how to craft prompts that generate stunning, unique artwork with our AI tools.",
    date: "2025-01-02",
    category: "Tutorial",
  },
  {
    id: 3,
    title: "Community Spotlight: January 2025",
    excerpt: "Highlighting some of the most impressive creations from our community this month.",
    date: "2025-01-03",
    category: "Community",
  },
];

export default function Blog() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Blog</h1>
        
        <p className="text-muted-foreground mb-8">
          News, tutorials, and updates from the Zenth team.
        </p>

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  {post.category}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {post.title}
              </h2>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <span className="text-primary text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Read more <ArrowRight className="h-4 w-4" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
