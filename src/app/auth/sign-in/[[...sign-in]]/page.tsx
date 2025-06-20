import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sign-in-view';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Authentication | Sign In',
  description: 'Sign In page for authentication.'
};

export default async function Page() {
  return <SignInViewPage/>
}