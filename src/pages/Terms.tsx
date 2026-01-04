import { MainLayout } from "@/components/layout/MainLayout";

export default function Terms() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Terms of Service</h1>
        
        <p className="text-muted-foreground mb-6">
          Last updated: January 1, 2025
        </p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using Zenth, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. User Accounts</h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the security of your account and all activities 
              that occur under your account. You must provide accurate information when creating 
              an account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. User Content</h2>
            <p className="text-muted-foreground">
              You retain ownership of content you create using our AI tools. By posting content, 
              you grant Zenth a non-exclusive license to display and distribute your content on 
              the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Prohibited Uses</h2>
            <p className="text-muted-foreground">
              You may not use Zenth to generate or share content that is illegal, harmful, 
              threatening, abusive, harassing, defamatory, or otherwise objectionable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The Zenth platform, including its design, features, and technology, is owned by 
              Zenth and protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate your account for violations of these 
              terms or for any other reason at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact</h2>
            <p className="text-muted-foreground">
              Questions about these terms? Contact us at{" "}
              <a href="mailto:legal@zenth.art" className="text-primary hover:underline">
                legal@zenth.art
              </a>
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
