import { MainLayout } from "@/components/layout/MainLayout";

export default function Privacy() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
        
        <p className="text-muted-foreground mb-6">
          Last updated: January 1, 2025
        </p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly, such as your email address, username, 
              and profile information. We also collect usage data to improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">How We Use Your Information</h2>
            <ul className="text-muted-foreground list-disc pl-5 space-y-2">
              <li>To provide and maintain our services</li>
              <li>To notify you about changes to our services</li>
              <li>To provide customer support</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to access, update, or delete your personal information. 
              You can manage your data through your account settings or by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Cookies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to track activity on our service 
              and hold certain information to improve your experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Third-Party Services</h2>
            <p className="text-muted-foreground">
              We may use third-party services that collect, monitor, and analyze data. 
              These services have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, contact us at{" "}
              <a href="mailto:privacy@zenth.art" className="text-primary hover:underline">
                privacy@zenth.art
              </a>
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
