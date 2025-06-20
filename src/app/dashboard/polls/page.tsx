'use client';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { PieGraph } from '@/features/overview/components/pie-graph';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const colors = [
  '#FA812F',
  '#FB9E3A',
  '#E6521F',
  '#EA2F14',
  '#521C0D'
]

export default function Page() {

  const [event , setEvent] = useState<any>()  
  const [openCard, setOpenCard] = useState<string | number | null>(null);
  const [polls , setPolls] = useState<any>([])  

  const toggleCard = (key: string | number, id: string | number, ind: number) => {
    setOpenCard(prev => (prev === key ? null : key));
    fetchResults(id, ind);
  };

  const [events, setEvents] = useState([]);
  const [selectLoading, setSelectLLoading] = useState(true);
  const [cardLoading, setCardLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(true);
  const fetchEvents = async () => {
    try {
      const res = await fetch("https://unetech-apis-production.up.railway.app/api/events/search?event=nestle");
      const data = await res.json();
      setEvents(data);
      setEvent(data[0].name)
    } catch (error) {
      console.log("Error fetching events:", error);
    } finally {
      setSelectLLoading(false);
    }
  };

  const fetchPolls = async () => {
    try {
      const res = await fetch("https://unetech-apis-production.up.railway.app/api/polls/search?eventId="+event);
      const data = await res.json();
      setPolls(data)
      console.log(data)
    } catch (error) {
      console.log("Error fetching events:", error);
    } finally {
      setCardLoading(false);
    }
  };

  const fetchResults = async (id: any, ind: number) => {
    setResultsLoading(true)
    try {
      const res = await fetch(`https://unetech-apis-production.up.railway.app/api/polls/get-results?eventId=${event}&id=${id}`);
      const data = await res.json();
      polls[0].polls[ind].results = data
      console.log(polls)
      setPolls(polls)
      console.log(data)
    } catch (error) {
      console.log("Error fetching events:", error);
    } finally {
        setResultsLoading(false)
    }
  };

  useEffect(() => {
    fetchEvents()
  },[])

  useEffect(() => {
    if(event){
        setCardLoading(true);
        fetchPolls()
    }
  },[event])

  return (
    <PageContainer scrollable={true}>
        <div className='flex flex-1 flex-col space-y-4'>
            <div className='flex items-start justify-between'>
                <Heading
                    title='Polls'
                    description='View the live results of a on going poll'
                />
                <Link
                    href='/dashboard/polls/new-poll'
                    className={cn(buttonVariants(), 'text-xs md:text-sm')}
                >
                    <IconPlus className='mr-2 h-4 w-4' /> Create
                </Link>
            </div>
            <Separator />
            {selectLoading ? (<Skeleton className='size-full h-25' />) : (
                <Select
                    onValueChange={(value) => setEvent(value)}
                >
                    <SelectTrigger className='size-full'>
                        <SelectValue placeholder='Select Event'  defaultValue={event}/>
                    </SelectTrigger>
                    <SelectContent>
                        {events.map((items:any) => {
                            return <SelectItem key={items.eventId} value={items.eventId}>{items.name}</SelectItem>
                        })}
                    </SelectContent>
                </Select>
            )}
            {cardLoading ? (<Skeleton className='size-full h-60' />) : (
                <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-1'>
                    {polls[0]?.polls?.length ? (polls[0].polls.map((items:any, index:number) => {
                        const cardKey = index;
                        const isOpen = openCard === cardKey;

                        return (<Card key={index} className='@container/card'>
                            <CardHeader>
                                <CardDescription>
                                    Question:
                                </CardDescription>
                                <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                                    {items.question}
                                </CardTitle>
                                <CardAction>
                                    <Button variant='outline' className='cursor-pointer' onClick={() => toggleCard(cardKey, items._id, index)}>
                                        {isOpen ? 'Hide Results' : 'View Results'}
                                    </Button>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <div className='line-clamp-1 flex gap-2 font-medium mb-4'>
                                    Options
                                </div>
                                {items.options.map((option:any, index:any) => {
                                    return (<div key={index} className='text-muted-foreground mb-2 flex items-center'>
                                        <span className='w-5 h-5 block mr-4' style={{ borderRadius: '4px', backgroundColor: colors[index] }}></span>
                                        <span>{option.text}</span>
                                    </div>)
                                })}
                            </CardContent>
                            {isOpen && (<CardFooter className='w-full h-auto'>
                                {!resultsLoading ? (
                                    <PieGraph 
                                        {...items}
                                    />
                                ): (
                                    <Skeleton className='size-full h-100' />
                                )
                                }
                            </CardFooter>)}
                        </Card>)
                    })) : 
                        (<Card className='@container/card'>
                            <CardHeader>
                                <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                                    No Polls Found for this Event
                                </CardTitle>
                            </CardHeader>
                        </Card>)
                    }
                </div>
            )}
        </div>
    </PageContainer>
  );
}
