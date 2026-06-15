
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata = {
    title: 'Privacy & Policy | JobGenie',
    description: 'Read the Privacy & Policy for JobGenie.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          <CardDescription>Last updated: {lastUpdated}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <p>
            Welcome to JobGenie. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may collect on the Service includes:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>
                <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and demographic information, that you voluntarily give to us when you register with the application.
              </li>
              <li>
                <strong>Resume Data:</strong> When you upload a resume or build one using our service, we collect the information contained within it, including your work experience, education, skills, and contact information.
              </li>
              <li>
                <strong>Derivative Data:</strong> Information our servers automatically collect when you access the application, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the application.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
            <p>
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the application to:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Create and manage your account.</li>
              <li>Provide AI-powered services such as resume analysis, career roadmap generation, and job recommendations.</li>
              <li>Email you regarding your account or order.</li>
              <li>Increase the efficiency and operation of the application.</li>
              <li>Monitor and analyze usage and trends to improve your experience with the application.</li>
            </ul>
          </div>

           <div className="space-y-2">
            <h2 className="text-xl font-semibold">3. Disclosure of Your Information</h2>
            <p>
              We do not share, sell, rent or trade your information with third parties for their commercial purposes. We may share information we have collected about you in certain situations:
            </p>
             <ul className="list-disc list-inside space-y-1 pl-4">
              <li>
                <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
              </li>
              <li>
                <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, hosting services, and customer service. Our AI features are powered by Google's Generative AI models.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">4. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </div>

          <div className="spacey-2">
            <h2 className="text-xl font-semibold">5. Policy for Children</h2>
            <p>
              We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">6. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">7. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:supportqvs@gmail.com" className="text-primary hover:underline">supportqvs@gmail.com</a>
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 border rounded-xl bg-background shadow-sm w-full max-w-sm mx-auto mt-8">
            <span className="font-semibold text-foreground uppercase tracking-wider text-xs">Developed by</span>
            <img 
              src="/qvs-logo.png" 
              alt="Quantum Vision Studios Logo" 
              width={200} 
              height={80} 
              className="object-contain" 
            />
            <span className="text-sm mt-2">
              Support:{' '}
              <a href="mailto:supportqvs@gmail.com" className="hover:underline text-primary font-medium">
                supportqvs@gmail.com
              </a>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
