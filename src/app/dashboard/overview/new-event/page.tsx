'use client';

import { FileUploader } from '@/components/file-uploader';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconLoader2, IconPlus, IconRowRemove, IconTrash } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import * as z from 'zod';
import { Toaster } from '@/components/ui/sonner';

export default function Page() {
    let router = useRouter();

    const searchParams = useSearchParams()
    let type:any = searchParams.get('type')

    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<any>([]);

    const fetchEvents = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/events/search?eventId="+type);
            const data = await res.json();
            setEvents(data[0]);
        } catch (error) {
            console.log("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    let defaultValues = {};

    if(type){
        defaultValues = {
            name: events?.name||'',
            venue: events?.venue||'',
            brand: events?.brand||'',
            description: events?.description||'',
            shortDescription: events?.shortDescription||'',
            status: events?.status||'',
            schedule: events?.schedule,
        }
    }else{
        defaultValues ={
            name: '123',
            venue: 'fl;lf',
            brand: 'fdggcd',
            description: 'dfkjfnkjdfnfdjn jknv',
            shortDescription: 'klfsjlksdjfdslcmlk kcmn',
            status: 'upcoming',
            schedule: [defaultSchedule],
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: defaultValues
    });

    const {
        fields: scheduleFields,
        append: appendSchedule,
        remove: removeSchedule,
    } = useFieldArray({
        control: form.control,
        name: 'schedule',
    });

    useEffect(() => {
        if(type){
            fetchEvents();
        }else{
            setLoading(false)
        }
    }, []);
    

    const [creating, setCreating] = useState(false)

    async function createEvent(values: z.infer<typeof formSchema>){
        try {
            setCreating(true);

            const res = await fetch("http://localhost:5000/api/events/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            setCreating(false);

            const data = await res.json();

            if (res.status === 200) {
                router.back();
            } else {
                console.error("Server Error:", data);
                alert(data?.message)
            }

        } catch (err) {
            setCreating(false);
            console.log("Network Error:", err);
        }

    }

    async function updateEvent(values: z.infer<typeof formSchema>) {
        console.log(values)
        try {
            const res = await fetch(`http://localhost:5000/api/events/update?eventId=${values.eventId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (res.status === 200) {
                router.back();
            } else {
                console.error("Server Error:", data);
                alert(data?.message)
            }
        } catch (error) {
            console.log("Error fetching events:", error);
        } finally {
            setCreating(false);
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setCreating(true);
        values.eventId = values.name.replace(/ /g,"_");
        values.event = 'nestle';
        console.log(values)
        if(type){
            updateEvent(values);
        }else{
            createEvent(values);
        }
    }

  return (
    <PageContainer scrollable>
        <div className='detal flex-1 space-y-4'>
            {loading ? (<FormCardSkeleton />):(
                <Card className='mx-auto w-full'>
                <CardHeader>
                    <Toaster visibleToasts={2}/>
                    <CardTitle className='text-left text-2xl font-bold'>
                        Create New Event
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <div className='text-2xl font-medium mb-4'>
                            General Information
                        </div>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className='size-full mt-4'>
                                                    <SelectValue placeholder='Select Status' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                                    <SelectItem value="live">Live</SelectItem>
                                                    <SelectItem value="offline">Offline</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            

                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Enter Event name' {...field} disabled={type ? true : false}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='venue'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Venue</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Enter Event name' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='brand'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Brand Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Enter Event name' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='shortDescription'
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Short Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter Short Description' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* <FormField
                                control={form.control}
                                name='poster'
                                render={({ field }) => (
                                    <div className='space-y-6'>
                                    <FormItem className='w-full'>
                                        <FormLabel>Posters</FormLabel>
                                        <FormControl>
                                            <FileUploader
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                maxFiles={4}
                                                maxSize={4 * 1024 * 1024}
                                                // disabled={loading}
                                                // progresses={progresses}
                                                // pass the onUpload function here for direct upload
                                                // onUpload={uploadFiles}
                                                // disabled={isUploading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    </div>
                                )}
                            /> */}
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                        placeholder='Enter Event description'
                                        className='resize-none'
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex items-center justify-between mb-4'>
                                <div className='text-2xl font-medium'>
                                    Schedule Information
                                </div>
                                <Button
                                    type='button'
                                    onClick={() => appendSchedule(defaultSchedule)}
                                >
                                    <IconPlus className='h-4 w-4' />
                                </Button>
                            </div>
                            {scheduleFields.map((schedule, scheduleIndex) => {
                                return (
                                        <ScheduleItem
                                            key={scheduleIndex}
                                            control={form.control}
                                            index={scheduleIndex}
                                            removeSchedule={removeSchedule}
                                        />
                                );
                            })}
                            <Button 
                                disabled={creating} 
                                type='submit'
                                className='cursor-pointer'
                            >
                                {creating&&<IconLoader2 />} 
                                {type ? 'Update' : 'Create'} Event
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                </Card>
            )}
        </div>
    </PageContainer>
  );
}


function ScheduleItem({index, removeSchedule }: { 
  control: any; 
  index: number; 
  removeSchedule: (index: number) => void 
}) {  
    const { control, setValue } = useFormContext();

    useEffect(() => {
    setValue(`schedule.${index}.day`, `Day ${index + 1}`);
    }, [index, setValue]);
  
  const {
    fields: sessionFields,
    append: appendSession,
    remove: removeSession,
  } = useFieldArray({
    control,
    name: `schedule.${index}.sessions`,
  });

  return (
    <div key={index} className='border p-4 rounded-xl space-y-6'>
        <div className='flex p-4 items-end justify-between mb-4 pl-2 pr-2'>
            <FormField
                control={control}
                name={`schedule.${index}.day`}
                render={({ field }) => (
                <FormItem className='w-full'>
                    <FormLabel>Day</FormLabel>
                    <FormControl>
                        <Input 
                            {...field} 
                            value={`Day ${index + 1}`}
                            disabled
                            placeholder='Enter session time' 
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            {index >= 1 && (
                <Button
                    type='button'
                    variant='destructive'
                    onClick={() => removeSchedule(index)}
                    className='ml-4'
                >
                    <IconTrash className='h-4 w-4' />
                </Button>
            )}

        </div>
        <div className='pl-2 pr-2'>
            <FormField
                control={control}
                name={`schedule.${index}.date`}
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                        <Input placeholder='Enter session time' {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <div className='flex p-4 items-center justify-between mb-4 pl-2 pr-2'>
            <h2 className='text-xl font-semibold'>Session</h2>
            <Button
                type='button'
                variant='default'
                onClick={() => appendSession({ time: '', title: '', description: '' })}
            >
                <IconPlus className='h-4 w-4' />
            </Button>
        </div>
        {sessionFields.map((session, sessionIndex) => {
            return (
                <div key={session.id} className='border p-4 rounded-lg space-y-4 ml-2 mr-2'>
                    <div className='w-full flex items-center justify-end'>
                        {sessionFields.length > 1 && (
                            <Button
                            type='button'
                            variant='destructive'
                            onClick={() => removeSession(sessionIndex)}
                            >
                                <IconTrash className='h-4 w-4' />
                            </Button>
                        )}
                    </div>
                    <div  className='grid grid-cols-1 md:grid-cols-2 gap-4 relative'>
                        <FormField
                            control={control}
                            name={`schedule.${index}.sessions.${sessionIndex}.time`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Time</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter session time' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`schedule.${index}.sessions.${sessionIndex}.title`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Topic</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter session Topic' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`schedule.${index}.sessions.${sessionIndex}.venue`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Venue</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter session venue' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`schedule.${index}.sessions.${sessionIndex}.description`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter session description' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-lg font-semibold'>Speaker</h2>
                    </div>
                    <div  className='grid grid-cols-1 md:grid-cols-2 gap-4 relative'>
                        <FormField
                            control={control}
                            name={`schedule.${index}.sessions.${sessionIndex}.speaker.name`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                <Input placeholder='Speaker Name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`schedule.${index}.sessions.${sessionIndex}.speaker.title`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                <Input placeholder='Speaker Title' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`schedule.${index}.sessions.${sessionIndex}.speaker.designation`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Designation</FormLabel>
                                <FormControl>
                                <Input placeholder='Designation' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-lg font-semibold'>Moderator</h2>
                    </div>
                    <div  className='grid grid-cols-1 md:grid-cols-2 gap-4 relative'>
                        <FormField
                            control={control}
                            name={`schedule.${index}.sessions.${sessionIndex}.moderator.name`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                <Input placeholder='Moderator Name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`schedule.${index}.sessions.${sessionIndex}.moderator.title`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                <Input placeholder='Moderator Title' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`schedule.${index}.sessions.${sessionIndex}.moderator.designation`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Designation</FormLabel>
                                <FormControl>
                                <Input placeholder='Designation' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </div>
            )
        })}
    </div>
  );
}


const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const speakerSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  picture: z.string().optional(), // Change to `z.string().url()` if using URLs
  designation: z.string().optional(),
  description: z.string().optional(),
});

const ModeratorSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  picture: z.string().optional(), // Change to `z.string().url()` if using URLs
  designation: z.string().optional(),
  description: z.string().optional(),
});

const questionSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const sessionSchema = z.object({
  time: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(10),
  venue: z.string().optional(),
  speaker: speakerSchema,
  moderator: ModeratorSchema,
  sessionsFeedback: z.string().optional(),
  panelist: z.array(speakerSchema).optional(),
  questions: z.array(questionSchema).optional(),
});

const scheduleItemSchema = z.object({
  date: z.string(),
  day: z.string(),
  sessions: z.array(sessionSchema).min(1),
});

const formSchema:any = z.object({
//   poster: z
//     .any()
//     .refine((files) => files?.length == 1, 'Image is required.')
//     .refine(
//       (files) => files?.[0]?.size <= MAX_FILE_SIZE,
//       `Max file size is 5MB.`
//     )
//     .refine(
//       (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
//       '.jpg, .jpeg, .png and .webp files are accepted.'
//     ),
  status: z.enum(['upcoming', 'live', 'offline'], {
    required_error: 'Status is required',
  }),
  name: z.string().min(2, {
    message: 'Event name must be at least 2 characters.'
  }),
  venue: z.string().min(5, {
    message: 'Venue must be at least 5 characters.'
  }),
  brand: z.string().min(5),
  description: z.string().min(15, {
    message: 'Description must be at least 15 characters.'
  }),
  shortDescription: z.string().min(10, {
    message: 'Short Description must be at least 15 characters.'
  }),
  schedule: z.array(scheduleItemSchema).min(1, {
    message: 'Add Atleast 1 session'
  }),
});

const defaultSchedule = {
    date: Date(),
    day: '',
    sessions:[
        {
            time: '10:00 am to 12:00 am',
            title: 'Inaguration Ceremony',
            description: 'This is some Description',
            venue: 'pc hotel',
            speaker: {
                name: 'Badar',
                title: 'Initiator',
                picture: '',
                designation: '',
                description: 'This is some Description',
            },
            sessionsFeedback: '',
            panelist: [
                {
                    name: 'Badar',
                    title: 'Initiator',
                    picture: '',
                    designation: '',
                    description: 'This is some Description',
                }
            ],
            moderator: {
                name: '',
                title: '',
                picture: '',
                designation: '',
                description: '',
            },
            questions: [],
        },
    ]
}

    

