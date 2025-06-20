'use client';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

export default function Page() {

    const [events, setEvents] = useState<any>([]);
    const [schedule, setSchedule] = useState<any>({});
    const [event , setEvent] = useState<any>()  

    const [selectLoading, setSelectLLoading] = useState(true);
    const [cardLoading, setCardLoading] = useState(true);

    const [openCard, setOpenCard] = useState<string | number | null>(null);

    const [answer, setAnswer] = useState<any>({})

    const toggleCard = (key: string | number) => {
        setOpenCard(prev => (prev === key ? null : key));
    };
    
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
        console.log(events, 'select')
      }
    };

    const fetchQuestions = async () => {
        try {
            const res = await fetch("https://unetech-apis-production.up.railway.app/api/events/search?eventId="+event);
            const data = await res.json();
            setSchedule(data[0])
        } catch (error) {
            console.log("Error fetching events:", error);
        } finally {
            setCardLoading(false);
            console.log(schedule, 'schedule')
        }
    };

    useEffect(() => {
        fetchEvents()
    },[])

    useEffect(() => {
        setAnswer({})
        if(event){
            setCardLoading(true);
            fetchQuestions()
        }
    },[event])
    
    const handleSend = async () => {
        if (answer.newAnswer.trim()) {
            try {
                const res = await fetch(`https://unetech-apis-production.up.railway.app/api/events/update-answer`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(answer),
                });

                const data = await res.json();

                if (res.status === 200) {
                    alert(data?.message)
                } else {
                    console.error("Server Error:", data);
                    alert(data?.message)
                }
            } catch (error) {
                console.log("Error fetching events:", error);
            } finally { }
        }
    };

  return (
    <PageContainer scrollable={true}>
            <div className='flex flex-1 flex-col space-y-4'>
                <div className='flex items-start justify-between'>
                    <Heading
                        title='Questions'
                        description='View the live questions asked by audiance'
                    />
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
                        {   schedule?.schedule ? (schedule?.schedule.map((days:any, index:number) => {
                                const cardKey = index;
                                const isOpen = openCard === cardKey;

                                return (
                                <Card key={index} className='@container/card'>
                                    <CardHeader>
                                        <CardDescription>
                                            {days?.date}
                                        </CardDescription>
                                        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                                            {days?.day}
                                        </CardTitle>
                                        <CardAction>
                                            <Button variant='outline' className='cursor-pointer' onClick={() => toggleCard(cardKey)}>
                                                {isOpen ? 'Hide Questions' : 'View Questions'}
                                            </Button>
                                        </CardAction>
                                    </CardHeader>
                                    {isOpen && (<CardContent className='w-full h-auto'>
                                        {days.sessions.map((session:any, ind:any) => {
                                            return (
                                                <div key={ind} className='w-full mb-4'>
                                                    <Separator />
                                                    <CardDescription className='mt-4'>
                                                        Session
                                                    </CardDescription>
                                                    <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl mb-4'>
                                                        {session.title}
                                                    </CardTitle>
                                                    {session?.questions?.length ? (session.questions.map((question:any, i:any) => {
                                                            return (
                                                                <div key={i} className='mb-5'>                                                                    
                                                                    <div className='text-xl font-semibold mb-2 flex items-center'>
                                                                        <span className="mr-2">Q:</span>
                                                                        <span>{question.question}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Input
                                                                            type="text"
                                                                            placeholder='Enter Answer' 
                                                                            defaultValue={question?.answer}
                                                                            value={answer.newAnswer}
                                                                            onChange={(e) => {
                                                                                const updateAnswer = {
                                                                                    eventId: schedule._id, 
                                                                                    scheduleId: schedule.schedule[index]._id, 
                                                                                    sessionId: schedule.schedule[index].sessions[ind]._id, 
                                                                                    questionId: schedule.schedule[index].sessions[ind].questions[i]._id, 
                                                                                    newAnswer: e.target.value
                                                                                };
                                                                                setAnswer(updateAnswer)
                                                                            }}
                                                                            className="p-2"
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') handleSend();
                                                                            }}
                                                                        />
                                                                        <Button
                                                                            onClick={handleSend}
                                                                            variant={'default'}
                                                                        >
                                                                            Send
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })):(<div className='text-muted-foreground mb-2 flex items-center'>
                                                            <span className="mr-2">No Questions for this session</span>
                                                        </div>)
                                                    }
                                                </div>
                                            )
                                        })}
                                    </CardContent>)}
                                </Card>
                                )
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
