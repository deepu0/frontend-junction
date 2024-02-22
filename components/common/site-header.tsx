import Link from 'next/link';
import { ModeToggle } from './toggle-theme';
import Image from 'next/image';

export function SiteHeader() {
  return (
    <header className='z-[50] fixed top-0 w-full border-b  '>
      <div className='container mb-2 mt-2 flex content-center items-center justify-between text-base'>
        <h1 className='text-lg font-bold'>Frontend Junction</h1>
        <div className='flex flex-1 items-center  space-x-2 justify-end'>
          <nav className='flex items-center'>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
