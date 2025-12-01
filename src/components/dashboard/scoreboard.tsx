'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { BarChart } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from 'recharts';

const chartData = [
  { category: 'resume', score: 78, fill: 'var(--color-resume)' },
  { category: 'skills', score: 85, fill: 'var(--color-skills)' },
  { category: 'experience', score: 65, fill: 'var(--color-experience)' },
  { category: 'projects', score: 92, fill: 'var(--color-projects)' },
];

const chartConfig = {
  score: {
    label: 'Score',
  },
  resume: {
    label: 'Resume ATS Score',
    color: 'hsl(var(--chart-1))',
  },
  skills: {
    label: 'Skills Match',
    color: 'hsl(var(--chart-2))',
  },
  experience: {
    label: 'Experience Alignment',
    color: 'hsl(var(--chart-3))',
  },
  projects: {
    label: 'Project Strength',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function Scoreboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="size-5" />
          Profile Scoreboard
        </CardTitle>
        <CardDescription>
          A consolidated view of your profile strength based on our analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <RechartsBarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 10 }}
          >
            <XAxis type="number" dataKey="score" hide />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="score" layout="vertical" radius={5} />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
