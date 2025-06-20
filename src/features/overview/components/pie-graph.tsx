'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const colors = [
  '#FA812F',
  '#FB9E3A',
  '#E6521F',
  '#EA2F14',
  '#521C0D'
]

export function PieGraph( config:any ) {
  React.useEffect(() => {
    console.log(config)
  })
  const totalVisitors = React.useMemo(() => {
    return config.results.reduce((acc:any, curr:any) => acc + curr.votes, 0);
  }, []);

  return (
    <Card className='@container/card w-full'>
      <CardHeader>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={config.options}
          className='mx-auto aspect-square h-180 w-180'
        >
          <PieChart>
            <defs>
              {config.options.map(
                (item:any, index:any) => (
                  <linearGradient
                    key={item.id}
                    id={`fill${colors[index]}`}
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='0%'
                      stopColor={item.id}
                      stopOpacity={1 - index * 0.15}
                    />
                    <stop
                      offset='100%'
                      stopColor={item.id}
                      stopOpacity={0.8 - index * 0.15}
                    />
                  </linearGradient>
                )
              )}
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={config.results.map((item:any, index:any) => ({
                ...item,
                fill: `${colors[index]}`
              }))}
              dataKey='votes'
              nameKey='label'
              innerRadius={180}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Total Votes
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
