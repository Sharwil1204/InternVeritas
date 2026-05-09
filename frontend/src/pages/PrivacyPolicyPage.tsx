import { Navbar } from '../components/Navbar';
import { ParticlesBackground } from '../components/ParticlesBackground';
import { Footer } from '../components/Footer';
import { Shield } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-[#020818] text-white relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <Shield className="h-6 w-6 text-violet-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
          <p className="text-white/40 text-sm mb-8">Last updated: May 9, 2026</p>
          
          <div className="space-y-6 text-white/70 text-sm leading-relaxed" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            
            <section>
              <h2 className="text-lg font-semibold text-white mb-2">1. Introduction</h2>
              <p>Welcome to InternVeritas ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website and use our internship scam detection services. Please read this policy carefully. By using our platform, you consent to the practices described herein.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">2. Information We Collect</h2>
              <p className="mb-2">We collect information that you voluntarily provide to us when you use our scam detection platform:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Uploaded documents (PDFs, images, PowerPoint files) submitted for analysis.</li>
                <li>Text inputs including company names, email addresses, advertisement content, and LinkedIn profile URLs.</li>
                <li>Responses to verification questions such as payment requirements and interview process details.</li>
                <li>Feedback and comments you submit through our feedback form.</li>
                <li>Account information if you choose to create an account (email, display name).</li>
              </ul>
              <p className="mt-2">We may also automatically collect certain technical information including your IP address, browser type, operating system, referring URLs, and usage patterns through cookies and similar technologies.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">3. How We Use Your Information</h2>
              <p className="mb-2">We use the information we collect for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>To provide, operate, and maintain our scam detection services.</li>
                <li>To process and analyze uploaded documents using AI and rule-based models.</li>
                <li>To perform company verification, domain age analysis, and SSL certificate checks.</li>
                <li>To generate risk assessment reports and trust scores.</li>
                <li>To improve the accuracy and effectiveness of our detection algorithms.</li>
                <li>To respond to your inquiries and provide customer support.</li>
                <li>To send you updates, security alerts, and administrative messages.</li>
                <li>To detect, prevent, and address technical issues or fraudulent activity.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">4. Third-Party Services</h2>
              <p className="mb-2">To provide advanced AI-powered analysis, we utilize the following third-party services:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="text-white/90">Groq API:</span> For AI-based text analysis and scam pattern detection using large language models.</li>
                <li><span className="text-white/90">Google Serper API:</span> For searching and verifying company website information.</li>
                <li><span className="text-white/90">RDAP/WHOIS Services:</span> For domain registration age verification.</li>
                <li><span className="text-white/90">Supabase:</span> For secure data storage and user authentication.</li>
                <li><span className="text-white/90">Vercel:</span> For website hosting and deployment.</li>
              </ul>
              <p className="mt-2">By using our platform, you acknowledge that text extracted from your uploaded documents may be sent to these third-party providers for processing. Each provider has its own privacy policy governing how they handle data.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">5. Data Retention and Storage</h2>
              <p>We do not permanently store your uploaded files. Documents are processed in-memory and are automatically deleted after analysis is complete. Analysis results and anonymized metadata may be retained for a limited period to improve our detection algorithms. Feedback submissions are stored in our database to help improve our services. You may request deletion of your data at any time by contacting us.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">6. Data Security</h2>
              <p>We implement industry-standard security measures including SSL/TLS encryption for data in transit, secure API authentication, and access controls. However, no method of electronic transmission or storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">7. Cookies and Tracking</h2>
              <p>We use essential cookies to maintain session state and user authentication. We do not use third-party advertising cookies or tracking pixels. You can configure your browser to refuse cookies, but some features of our platform may not function properly without them.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">8. Children's Privacy</h2>
              <p>Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that we have inadvertently collected information from a child under 13, we will take steps to delete such information promptly.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">9. Your Rights</h2>
              <p className="mb-2">Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The right to access the personal information we hold about you.</li>
                <li>The right to request correction of inaccurate or incomplete data.</li>
                <li>The right to request deletion of your personal data.</li>
                <li>The right to withdraw consent at any time.</li>
                <li>The right to data portability.</li>
                <li>The right to lodge a complaint with a supervisory authority.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">10. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of the platform after any changes constitutes your acceptance of the revised policy.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">11. Contact Us</h2>
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
              <p className="mt-1">Email: <span className="text-violet-400">internveritas.official@gmail.com</span></p>
            </section>

          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};
