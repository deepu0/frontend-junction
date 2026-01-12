import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function FooterComponent() {
  return (
    <footer className='w-full border-t border-white/10 bg-background/50 backdrop-blur-xl'>
      <div className='container mx-auto px-4 py-12 md:py-16'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-12'>
          <div className='col-span-1 md:col-span-2'>
            <Link href='/' className='inline-block mb-4'>
              <span className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary'>
                Frontend Junction
              </span>
            </Link>
            <p className='text-muted-foreground max-w-sm text-sm leading-relaxed'>
              The ultimate platform for frontend engineers to share experiences,
              prepare for interviews, and find their dream jobs.
            </p>
          </div>

          <div>
            <h4 className='font-semibold mb-4 text-foreground'>Platform</h4>
            <ul className='space-y-3 text-sm text-muted-foreground'>
              <li>
                <Link
                  href='/interview-experience'
                  className='hover:text-primary transition-colors'
                >
                  Browse Stories
                </Link>
              </li>
              <li>
                <Link
                  href='/jobs'
                  className='hover:text-primary transition-colors opacity-50 cursor-not-allowed'
                >
                  Job Board{' '}
                  <span className='text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1'>
                    SOON
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href='https://topmate.io/deepak_sharma'
                  className='hover:text-primary transition-colors'
                >
                  Mentorship
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-semibold mb-4 text-foreground'>Community</h4>
            <div className='flex gap-4'>
              <a
                href='https://github.com/depaksharma'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-white transition-colors'
              >
                <FaGithub size={20} />
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-[#1DA1F2] transition-colors'
              >
                <FaTwitter size={20} />
              </a>
              <a
                href='https://www.linkedin.com/in/depaksharma/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-[#0A66C2] transition-colors'
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className='border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground'>
          <p>
            © {new Date().getFullYear()} Frontend Junction. All rights
            reserved.
          </p>
          <div className='flex gap-6'>
            <Link
              href='/privacy'
              className='hover:text-foreground transition-colors'
            >
              Privacy Policy
            </Link>
            <Link
              href='/terms'
              className='hover:text-foreground transition-colors'
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
