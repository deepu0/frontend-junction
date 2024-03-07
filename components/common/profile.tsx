import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { usePathname } from 'next/navigation';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '../session-provider';

export default function Profile() {
  const path = usePathname();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { user = '', setUser } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  const handleNavigate = () => {
    ('/add-experience');
  };
  const isAdmin = user?.role === 'admin';
  const isSub = user?.stripe_customer_id;

  return (
    <Popover>
      <PopoverTrigger>
        <Image
          src={user?.image_url!}
          alt={user?.display_name!}
          width={40}
          height={40}
          className='rounded-full ring-2 ring-green-500'
        />
      </PopoverTrigger>
      <PopoverContent className='space-y-3 divide-y p-2' side='bottom'>
        <div className='px-4'>
          <p className='text-sm'>{user?.display_name}</p>
          <p className='text-sm text-gray-500'>{user?.email}</p>
        </div>
        {path !== '/add-experience' && (
          <Button
            variant='ghost'
            className='w-full flex justify-between items-center'
            //onClick={handleNavigate}
          >
            <Link href='/add-experience'>Add Interview Experience</Link>
          </Button>
        )}
        {/* {isAdmin && (
					<Link href="/dashboard">
						<Button
							variant="ghost"
							className="w-full flex justify-between items-center"
						>
							Dashboard <DashboardIcon />
						</Button>
					</Link>
				)} */}

        <Button
          variant='ghost'
          className='w-full flex justify-between items-center'
          onClick={handleLogout}
        >
          Log out
        </Button>
      </PopoverContent>
    </Popover>
  );
}
