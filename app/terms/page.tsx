import React from 'react';

export const metadata = {
  title: 'Terms of Service | Frontend Junction',
  description:
    'Terms of Service for Frontend Junction - Our rules and guidelines.',
};

export default function TermsOfService() {
  return (
    <div className='container mx-auto px-4 py-24 max-w-4xl pt-32'>
      <h1 className='text-4xl font-bold mb-8 text-foreground'>
        Terms of Service
      </h1>

      <section className='prose prose-invert max-w-none text-muted-foreground space-y-6'>
        <p suppressHydrationWarning>
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using Frontend Junction, you agree to be bound by
          these Terms of Service. If you do not agree to these terms, please do
          not use our services.
        </p>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          2. Use of Service
        </h2>
        <p>
          You agree to use the service only for lawful purposes and in a way
          that does not infringe the rights of others or restrict their use and
          enjoyment of the service.
        </p>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          3. User Content
        </h2>
        <p>
          You are responsible for any content you post on Frontend Junction,
          including interview experiences. By posting content, you grant us a
          non-exclusive, royalty-free license to use, display, and distribute
          that content. We reserve the right to remove any content that violates
          our guidelines.
        </p>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          4. Intellectual Property
        </h2>
        <p>
          All content and materials available on Frontend Junction, including
          branding, logos, and UI design, are the property of Frontend Junction
          or its licensors and are protected by intellectual property laws.
        </p>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          5. Disclaimer of Warranties
        </h2>
        <p>
          The service is provided on an &quot;AS IS&quot; and &quot;AS
          AVAILABLE&quot; basis. We make no warranties, expressed or implied,
          regarding the accuracy, completeness, or reliability of any content on
          the platform.
        </p>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          6. Limitation of Liability
        </h2>
        <p>
          In no event shall Frontend Junction be liable for any indirect,
          incidental, special, or consequential damages arising out of or in
          connection with your use of the service.
        </p>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          7. Termination
        </h2>
        <p>
          We reserve the right to terminate or suspend your access to the
          service immediately, without prior notice, for any reason whatsoever,
          including breach of the Terms.
        </p>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          8. Governing Law
        </h2>
        <p>
          These terms shall be governed and construed in accordance with the
          laws of India, without regard to its conflict of law provisions.
        </p>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          9. Contact Us
        </h2>
        <p>
          If you have any questions about these Terms, please contact us at
          support@frontend-junction.com.
        </p>
      </section>
    </div>
  );
}
