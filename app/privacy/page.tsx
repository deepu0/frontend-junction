import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Frontend Junction',
  description:
    'Privacy Policy for Frontend Junction - Learn how we handle your data.',
};

export default function PrivacyPolicy() {
  return (
    <div className='container mx-auto px-4 py-24 max-w-4xl pt-32'>
      <h1 className='text-4xl font-bold mb-8 text-foreground'>
        Privacy Policy
      </h1>

      <section className='prose prose-invert max-w-none text-muted-foreground space-y-6'>
        <p>
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          1. Introduction
        </h2>
        <p>
          Welcome to Frontend Junction. We value your privacy and are committed
          to protecting your personal data. This Privacy Policy explains how we
          collect, use, and safeguard your information when you visit our
          website.
        </p>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          2. Information We Collect
        </h2>
        <p>
          We collect information that you provide directly to us, such as when
          you create an account, submit an interview experience, or contact us
          for support. This may include:
        </p>
        <ul className='list-disc pl-6 space-y-2'>
          <li>Name and email address</li>
          <li>Professional information (role, company)</li>
          <li>Interview experiences and feedback</li>
        </ul>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          3. How We Use Your Information
        </h2>
        <p>We use the information we collect to:</p>
        <ul className='list-disc pl-6 space-y-2'>
          <li>Provide and maintain our services</li>
          <li>Improve and personalize your experience</li>
          <li>Communicate with you about updates or support</li>
          <li>Protect against fraudulent or illegal activity</li>
        </ul>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          4. Cookies and Tracking
        </h2>
        <p>
          We use cookies and similar tracking technologies to track activity on
          our service and hold certain information. You can instruct your
          browser to refuse all cookies or to indicate when a cookie is being
          sent.
        </p>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          5. Data Security
        </h2>
        <p>
          The security of your data is important to us, but remember that no
          method of transmission over the Internet is 100% secure. While we
          strive to use commercially acceptable means to protect your personal
          data, we cannot guarantee its absolute security.
        </p>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          6. Changes to This Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the &quot;Last updated&quot; date.
        </p>

        <h2 className='text-2xl font-semibold text-foreground mt-8'>
          7. Contact Us
        </h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at support@frontend-junction.com.
        </p>
      </section>
    </div>
  );
}
