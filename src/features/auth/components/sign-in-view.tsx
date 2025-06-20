'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Metadata } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignInViewPage({ onSignIn }: any) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin_users/sign-in", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: 'nestle',
          email: email,
          password: password
        }),

      });
      const data = await res.json();
      localStorage.setItem('token',  data.token)
      await fetch('/api/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'nestle',
          token: data.token,
        }),
      }).then(() => {
        router.push('/dashboard/overview')
      });
    } catch (error) {
      console.log("Error fetching events:", error);
    } finally {}
  };

  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-zinc-900' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-6 w-6'
          >
            <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
          </svg>
          Logo
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
            </p>
            <footer className='text-sm'></footer>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          {/* //sign ui */}
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg w-full h-140 sm:w-[400px] flex flex-col items-center justify-between">
              <div className='w-full'>
                <h2 className="text-3xl text-white font-semibold mb-4 text-center">Sign in to Dashboard</h2>
                <p className="text-lg text-gray-400 mb-0 text-center">Welcome back!</p>
                <p className="text-lg text-gray-400 mb-0 text-center">Please sign in to continue</p>
              </div>
              <div className='w-full mb-10'>
                <Input
                  type="email"
                  placeholder="your_mail@example.com"
                  className="w-full h-12"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                />
                <Input
                  type="password"
                  placeholder="*********"
                  className="w-full h-12 mt-4"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                />
              </div>
              <Button onClick={() => fetchEvents()} variant={'default'} className="w-full mt-4 h-12">
                Continue
              </Button>
            </div>
          </div>

          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
