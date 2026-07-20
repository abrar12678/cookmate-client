export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-100">Privacy Policy</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mt-2">Last updated: January 2025</p>

      <div className="mt-10 space-y-8 text-neutral-600 dark:text-neutral-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">1. Information We Collect</h2>
          <p className="mb-2">We collect the following types of information to provide and improve CookMate AI services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account Information:</strong> Name, email address, and password when you create an account.</li>
            <li><strong>User Content:</strong> Recipes you create, reviews you write, and other content you submit through the platform.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our service, including pages visited, features used, and time spent.</li>
            <li><strong>AI Interaction Data:</strong> Ingredients you submit for recipe generation and food images you upload for analysis. This data is processed by our AI partners and may be stored temporarily.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">2. How We Use Your Information</h2>
          <p className="mb-2">We use the collected information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, maintain, and improve our AI recipe generation and food analysis services.</li>
            <li>Personalize your experience by remembering your preferences and saved recipes.</li>
            <li>Process and store your recipes, reviews, and favorites.</li>
            <li>Send newsletters and promotional communications (with your consent).</li>
            <li>Analyze usage patterns to improve our platform and develop new features.</li>
            <li>Ensure platform security and prevent fraud or abuse.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">3. AI Features & Third-Party Services</h2>
          <p>Our AI recipe generation and food analysis features are powered by third-party AI providers (such as OpenAI). When you use these features:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Your ingredient lists and food images are sent to our AI provider&apos;s servers for processing.</li>
            <li>These providers may store your data according to their own privacy policies.</li>
            <li>We do not share your account credentials or personal information with AI providers beyond what is necessary for the service.</li>
            <li>AI-generated recipes and analysis results are stored on our servers and associated with your account.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">4. Image Hosting</h2>
          <p>Recipe images you upload are hosted by ImgBB, a third-party image hosting service. By uploading images, you agree to ImgBB&apos;s terms of service. Images are publicly accessible via their URLs.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">5. Cookies & Local Storage</h2>
          <p>We use an httpOnly secure cookie to store your authentication token and browser local storage for your theme preference. We do not currently use tracking cookies, but we may implement analytics cookies in the future with appropriate disclosure.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">6. Data Security</h2>
          <p>We implement industry-standard security measures including encrypted password storage (bcrypt), JWT-based authentication, and HTTPS encryption for all data transmission. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">7. Data Retention</h2>
          <p>We retain your account information for as long as your account is active. You can request account deletion at any time by contacting us. AI interaction data is retained for up to 90 days for quality improvement purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">8. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. You can update your profile information through the app settings or contact us directly for data-related requests.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">10. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@cookmateai.com" className="text-primary-500 hover:underline">privacy@cookmateai.com</a> or through our <a href="/contact" className="text-primary-500 hover:underline">Contact page</a>.</p>
        </section>
      </div>
    </div>
  );
}