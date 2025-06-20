'use client';

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
import { Separator } from '@/components/ui/separator';
import { Product } from '@/constants/mock-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { Suspense, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

const pollOptionSchema = z.object({
  id: z.string(), // Unique ID for the option
  text: z.string().min(1, { message: "Option text cannot be empty" }),
});

const pollSchema = z.object({
  question: z.string().min(5, { message: "Poll question must be at least 5 characters" }),
  options: z.array(pollOptionSchema)
    .min(2, { message: "At least 2 options are required" })
    .max(5, { message: "You can add up to 10 options" }),
  allowMultipleVotes: z.boolean().default(false),
  allowCustomOption: z.boolean().default(false),
  expiresAt: z.string().optional(),
  eventId: z.string()
})

const formSchema:any = z.object({
    polls: z.array(pollSchema)
        .min(1, 'Add at least one poll')
        .max(3, 'Add MAX three poll')
});

const pollsData = {
    question: 'What would u like',
    options: [
        { id: "opt1", text: "Dark Mode", label: "opt1" },
        { id: "opt2", text: "Mobile App", label: "opt2" },
        { id: "opt3", text: "Light Mode", label: "opt3" },
        { id: "opt4", text: "Web App", label: "opt4" },
    ],
    eventId: 'nestle2025'
}

const events:any = [
    {
        title: 'nestle 2025',
        id: 'nestle2025'
    },
    {
        title: 'nestle 2024',
        id: 'nestle2024'
    },
    {
        title: 'nestle 2023',
        id: 'nestle2023'
    },
    {
        title: 'nestle 2022',
        id: 'nestle2022'
    }
];

export default function page({
  initialData,
  pageTitle
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const defaultValues = {
    polls: [pollsData]
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  const {
    fields: pollFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'polls',
  });

  const [event , setEvent] = useState('nestle2025')  
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    let pollsData= {
        event: 'nestle',
        [event]: values.polls
    }
    console.log(pollsData)
    // Form submission logic would be implemented here
  }

  return (
    <PageContainer scrollable>
        <div className='detal flex-1 space-y-4'>
            <Suspense fallback={<FormCardSkeleton />}>
                <Card className='mx-auto w-full'>
                <CardHeader>
                     <div className='flex justify-between items-center'>
                        <CardTitle className='text-left text-2xl font-bold'>
                            Create New Poll
                        </CardTitle>
                        <Button
                            type='button'
                            onClick={() =>append(pollsData)}
                        >
                            <IconPlus className='h-4 w-4' />
                        </Button>
                     </div>
                    <Select
                        onValueChange={(value) => setEvent(value)}
                    >
                        <SelectTrigger className='size-full mt-4'>
                            <SelectValue placeholder='Select Event' />
                        </SelectTrigger>
                        <SelectContent>
                            {events.map((items:any) => {
                                return <SelectItem key={items.id} value={items.id}>{items.title}</SelectItem>
                            })}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        {pollFields.map((poll, index) => (
                            <PollItem
                                key={poll.id}
                                index={index}
                                onRemove={() => remove(index)}
                                disableRemove={pollFields.length === 1}
                                control={form.control}
                            />
                        ))}
                        <Button type='submit'>Create Poll</Button>
                    </form>
                    </Form>
                </CardContent>
                </Card>
            </Suspense>
        </div>
    </PageContainer>
  );
}

interface PollItemProps {
  index: number;
  onRemove: () => void;
  disableRemove?: boolean;
  control: any
}

export function PollItem({ index, onRemove, disableRemove, control }: PollItemProps) {
  const {
    fields: optionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `polls.${index}.options`,
  });

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-1'>
        <div className='flex justify-between items-center'>
            <FormLabel className='text-xl'>Poll #{index + 1}</FormLabel>
            {!disableRemove && (
                <Button
                    type='button'
                    variant='destructive'
                    onClick={onRemove}
                >
                   <IconTrash className='h-4 w-4' />
                </Button>
            )}
        </div>
        <FormField
            control={control}
            name={`polls.${index}.question`}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                        <Input placeholder='Enter Question' {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <div className='space-y-4'>
            <div className='flex items-center justify-between mb-4'>
                <FormLabel>Options</FormLabel>
                <Button
                    variant={'default'}
                    type='button'
                    onClick={() => append({ text: '' })}
                    disabled={optionFields.length >= 5}
                >
                    <IconPlus className='h-4 w-4' />
                </Button>
            </div>
            {optionFields.map((option, optIndex) => (
                <FormField
                    key={option.id}
                    control={control}
                    name={`polls.${index}.options.${optIndex}.text`}
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex items-center gap-2'>
                                <FormControl>
                                    <Input placeholder='Enter option' {...field} />
                                </FormControl>
                                {optionFields.length > 2 && (
                                <Button
                                    variant='destructive'
                                    type='button'
                                    onClick={() => remove(optIndex)}
                                >
                                   <IconTrash className='h-4 w-4' />
                                </Button>
                                )}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ))}
        </div>
        <Separator />
    </div>

  )
}

