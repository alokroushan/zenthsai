import { MainLayout } from "@/components/layout/MainLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I create AI art on Zenth?",
    answer: "Click the 'Create Art' button in the sidebar, enter a descriptive prompt for your desired image, and click generate. Our AI will create a unique image based on your prompt.",
  },
  {
    question: "Is my artwork public by default?",
    answer: "Yes, by default your creations are shared publicly. You can toggle the visibility setting when creating or editing a post to make it private.",
  },
  {
    question: "How does the voting system work?",
    answer: "Users can upvote or downvote posts. The 'Hot' feed ranks posts based on votes and recency, while 'Top' shows the highest-voted posts overall.",
  },
  {
    question: "Can I edit or delete my posts?",
    answer: "Yes, you can edit or delete your own posts from your profile page or the post detail page.",
  },
  {
    question: "How do I report inappropriate content?",
    answer: "Click the three-dot menu on any post and select 'Report'. Our moderation team reviews all reports promptly.",
  },
  {
    question: "What makes a good prompt?",
    answer: "Be specific and descriptive. Include style references (e.g., 'oil painting', 'cyberpunk'), lighting conditions, colors, and mood. Longer, detailed prompts often produce better results.",
  },
];

export default function Help() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Help Center</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Find answers to common questions or get in touch with our support team.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="bg-card rounded-lg p-6 border border-border">
            <Mail className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Get help from our support team via email.
            </p>
            <a
              href="mailto:support@zenth.art"
              className="text-primary hover:underline text-sm"
            >
              support@zenth.art
            </a>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <MessageCircle className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Community</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Join our Discord community for tips and discussions.
            </p>
            <span className="text-primary text-sm">Coming soon</span>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
