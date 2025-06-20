
'use client';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heading } from '@/components/ui/heading';
import { IconDatabaseOff, IconLoader2, IconPlus } from '@tabler/icons-react';

export default function Page() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events/search?event=nestle");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.log("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin_users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: 'nestle',
          name: 'Nestle',
          email: 'admin@nestle.com',
          password: 'password@nestle.com'
        }),
      });
      const data = await res.json();
    } catch (error) {
      console.log("Error fetching events:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
        </div>
        <div className='flex items-start justify-between '>
          <Heading
            title='Events'
            description='Manage Events and Create New Events.'
          />
          <Link
            href='/dashboard/overview/new-event'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <Separator />
        {loading ? (
            <IconLoader2 />
          ):
          (    
            <div>
              <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3'>
                {events.length&&events.map((items:any) => {
                  return (
                    <Card key={items?.name} className='@container/card'>
                      <CardHeader>
                        <CardDescription>
                          &nbsp;
                          <Link
                            href='/dashboard/overview/detail?type=attendies'
                            className={cn(buttonVariants({variant:'link'}), 'px-0 py-0 h-auto underline')}
                          >
                            ({items.attendies?.length})
                          </Link>
                          &nbsp;
                          Attendies
                        </CardDescription>
                        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                          {items?.name}
                        </CardTitle>
                        <CardAction>
                          <Badge variant='outline'>
                            <Link href={'/dashboard/overview/new-event?type='+items?.eventId}>View Details</Link>
                          </Badge>
                        </CardAction>
                      </CardHeader>
                      <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                        <div className='line-clamp-1 flex gap-2 font-medium'>
                          {items?.description}
                        </div>
                        <div className='text-muted-foreground'>
                          Total {items?.joiners.length} people joined this event,
                          &nbsp;
                          <Link
                            href={'/dashboard/overview/detail?type=joiners'}
                            className={cn(buttonVariants({variant:'link'}), 'px-0 py-0 h-auto underline')}
                          >
                            Click here
                          </Link>
                          &nbsp;
                          to view more details
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
              {!events.length&&<div className='h-full w-full mt-40 flex items-center justify-center space-y-2 flex-col text-2xl font-bold tracking-tight'>
                  <IconDatabaseOff className='w-35 h-35 mb-4'/>
                  No Events Found
                </div>
              }
            </div>        
          )
        }
      </div>
    </PageContainer>
  );
}


  // const events = [
  //   {
  //     event: 'nestle',
  //     eventId: 'nestle2025',
  //     name: 'Nestle 2025',
  //     shortDescription: 'this is some short description',
  //     description: 'this is some description',
  //     poster: '',
  //     venue: 'Location 1',
  //     brand: 'Nestle',
  //     joiners: [
  //       {
  //         name: 'jhon Doe',
  //         email: 'jhon@gmail.com',
  //         phoneNo: '+923000021663'
  //       },
  //       {
  //         name: 'jhon Doe',
  //         email: 'jhon@gmail.com',
  //         phoneNo: '+923000021663'
  //       },
  //       {
  //         name: 'jhon Doe',
  //         email: 'jhon@gmail.com',
  //         phoneNo: '+923000021663'
  //       }
  //     ],
  //     attendies: [
  //       {
  //         name: 'jhon Doe',
  //         email: 'jhon@gmail.com',
  //         phoneNo: '+923000021663'
  //       },
  //       {
  //         name: 'jhon Doe',
  //         email: 'jhon@gmail.com',
  //         phoneNo: '+923000021663'
  //       },
  //       {
  //         name: 'jhon Doe',
  //         email: 'jhon@gmail.com',
  //         phoneNo: '+923000021663'
  //       }
  //     ],
  //     Organizers: [
  //       {
  //         name: 'Badar',
  //         title: 'Initiator',
  //         picture: '',
  //         designation: '',
  //         description: 'This is some Description',
  //       },
  //       {
  //         name: 'Jhon',
  //         title: 'CTO',
  //         picture: '',
  //         designation: '',
  //         description: 'This is some Description',
  //       },
  //       {
  //         name: 'Doe',
  //         title: 'CEO',
  //         picture: '',
  //         designation: '',
  //         description: 'This is some Description',
  //       },
  //     ],
  //     Speakers: [
  //       {
  //         name: 'Badar',
  //         title: 'Initiator',
  //         picture: '',
  //         designation: '',
  //         description: 'This is some Description',
  //       },
  //       {
  //         name: 'Jhon',
  //         title: 'CTO',
  //         picture: '',
  //         designation: '',
  //         description: 'This is some Description',
  //       },
  //       {
  //         name: 'Doe',
  //         title: 'CEO',
  //         picture: '',
  //         designation: '',
  //         description: 'This is some Description',
  //       },
  //     ],
  //     happeninings: [
  //       {
  //         title: 'New Happening 1',
  //         description: 'This is some Description',
  //         shortDescription: 'This is some Short Description',
  //         type: 'jpeg',
  //         resource: '', 
  //       },
  //       {
  //         title: 'New Happening 2',
  //         description: 'This is some Description',
  //         shortDescription: 'This is some Short Description',
  //         type: 'jpeg',
  //         resource: '', 
  //       },
  //     ],
  //     schedule: [
  //       {
  //         date: Date(),
  //         sessions:[
  //           {
  //             time: '10:00 am to 12:00 am',
  //             title: 'Inaguration Ceremony',
  //             description: 'This is some Description',
  //             speaker: {
  //               name: 'Badar',
  //               title: 'Initiator',
  //               picture: '',
  //               designation: '',
  //               description: 'This is some Description',
  //             },
  //             sessionsFeedback: '',
  //             panelist: [
  //               {
  //                 name: 'Badar',
  //                 title: 'Initiator',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //               {
  //                 name: 'Jhon',
  //                 title: 'CTO',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //               {
  //                 name: 'Doe',
  //                 title: 'CEO',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //             ],
  //             questions: [
  //               {
  //                 question: '',
  //                 answer: ''
  //               }
  //             ],
  //           },
  //           {
  //             time: '10:00 am to 12:00 am',
  //             title: 'Inaguration Ceremony',
  //             description: 'This is some Description',
  //             speaker: {
  //               name: 'Badar',
  //               title: 'Initiator',
  //               picture: '',
  //               designation: '',
  //               description: 'This is some Description',
  //             },
  //             sessionsFeedback: '',
  //             panelist: [
  //               {
  //                 name: 'Badar',
  //                 title: 'Initiator',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //               {
  //                 name: 'Jhon',
  //                 title: 'CTO',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //               {
  //                 name: 'Doe',
  //                 title: 'CEO',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //             ],
  //             questions: [
  //               {
  //                 question: '',
  //                 answer: ''
  //               }
  //             ],
  //           },
  //           {
  //             time: '10:00 am to 12:00 am',
  //             title: 'Inaguration Ceremony',
  //             description: 'This is some Description',
  //             speaker: {
  //               name: 'Badar',
  //               title: 'Initiator',
  //               picture: '',
  //               designation: '',
  //               description: 'This is some Description',
  //             },
  //             sessionsFeedback: '',
  //             panelist: [
  //               {
  //                 name: 'Badar',
  //                 title: 'Initiator',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //               {
  //                 name: 'Jhon',
  //                 title: 'CTO',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //               {
  //                 name: 'Doe',
  //                 title: 'CEO',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //             ],
  //             questions: [
  //               {
  //                 question: '',
  //                 answer: ''
  //               }
  //             ],
  //           },
  //         ]
  //       },
  //       {
  //         date: Date(),
  //         sessions:[
  //           {
  //             time: '10:00 am to 12:00 am',
  //             title: 'Inaguration Ceremony',
  //             description: 'This is some Description',
  //             speaker: {
  //               name: 'Badar',
  //               title: 'Initiator',
  //               picture: '',
  //               designation: '',
  //               description: 'This is some Description',
  //             },
  //             sessionsFeedback: '',
  //             panelist: [
  //               {
  //                 name: 'Badar',
  //                 title: 'Initiator',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //               {
  //                 name: 'Jhon',
  //                 title: 'CTO',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //               {
  //                 name: 'Doe',
  //                 title: 'CEO',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //             ],
  //             questions: [
  //               {
  //                 question: '',
  //                 answer: ''
  //               }
  //             ],
  //           },
  //           {
  //             time: '10:00 am to 12:00 am',
  //             title: 'Inaguration Ceremony',
  //             description: 'This is some Description',
  //             speaker: {
  //               name: 'Badar',
  //               title: 'Initiator',
  //               picture: '',
  //               designation: '',
  //               description: 'This is some Description',
  //             },
  //             sessionsFeedback: '',
  //             panelist: [
  //               {
  //                 name: 'Badar',
  //                 title: 'Initiator',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //               {
  //                 name: 'Jhon',
  //                 title: 'CTO',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //               {
  //                 name: 'Doe',
  //                 title: 'CEO',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //             ],
  //             questions: [
  //               {
  //                 question: '',
  //                 answer: ''
  //               }
  //             ],
  //           },
  //           {
  //             time: '10:00 am to 12:00 am',
  //             title: 'Inaguration Ceremony',
  //             description: 'This is some Description',
  //             speaker: {
  //               name: 'Badar',
  //               title: 'Initiator',
  //               picture: '',
  //               designation: '',
  //               description: 'This is some Description',
  //             },
  //             sessionsFeedback: '',
  //             panelist: [
  //               {
  //                 name: 'Badar',
  //                 title: 'Initiator',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //               {
  //                 name: 'Jhon',
  //                 title: 'CTO',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //               {
  //                 name: 'Doe',
  //                 title: 'CEO',
  //                 picture: '',
  //                 designation: '',
  //                 description: 'This is some Description',
  //               },
  //             ],
  //             questions: [
  //               {
  //                 question: '',
  //                 answer: ''
  //               }
  //             ],
  //           },
  //         ]
  //       }
  //     ],
  //   },
  // ]
