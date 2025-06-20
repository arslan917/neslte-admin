'use client';

import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense, useEffect } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { IconPlus } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation'

export default function Page() {
  const searchParams = useSearchParams()
  let type:any = searchParams.get('type')
  useEffect(() => {
    console.log(type)
  })
  let users = [
    {
      name: 'jhon Doe',
      email: 'jhon@gmail.com',
      phoneNo: '+923000021663'
    },
    {
      name: 'jhon doe1',
      email: 'jhon@gmail.com',
      phoneNo: '+923000021663'
    },
    {
      name: 'jhon doe2',
      email: 'jhon@gmail.com',
      phoneNo: '+923000021663'
    }
  ]

  const meta:any = {
    attendies: {
        title: 'Attendies',
        desc: 'List of attendies whot checked in the event'
    },
    joiners: {
        title: 'Joiners',
        desc: 'List of joiners whot checked in the event'
    }
  }
  return (
    <PageContainer scrollable>
      <div className='detal flex-1 space-y-4'>
        <div className='flex items-start justify-between '>
          <Heading
            title={meta[type].title}
            description={meta[type].desc}
          />
        </div>
        
        <Suspense fallback={<FormCardSkeleton />}>
          <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
            {users.map((items) => {
              return <Card key={items.name} className='@container/card'>
              <CardHeader>
                <CardDescription>
                  Email: {items.email}
                </CardDescription>
                <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                  {items.name}
                </CardTitle>
              </CardHeader>
              <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                <div className='line-clamp-1 flex gap-2 font-medium'>
                  Contat no: {items.phoneNo}
                </div>
              </CardFooter>
            </Card>})}
          </div>
        </Suspense>
      </div>
    </PageContainer>
  );
}


