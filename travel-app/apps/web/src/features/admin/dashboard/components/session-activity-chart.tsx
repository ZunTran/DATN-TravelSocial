'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

import type {
  SessionActivityByDay,
} from '../types/admin-dashboard.types';

interface Props {
  data: SessionActivityByDay[];
}

const chartConfig = {
  sessions: {
    label: 'Sessions',
    color: 'var(--chart-1)',
  },
  users: {
    label: 'Unique users',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function SessionActivityChart({
  data,
}: Props) {
  const chartData = data.map((item) => ({
    date: item.date,
    label: new Date(item.date).toLocaleDateString(
      'vi-VN',
      {
        day: '2-digit',
        month: '2-digit',
      },
    ),
    sessions: item.sessions,
    users: item.users,
  }));

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          User activity
        </h2>

        <p className="text-sm text-muted-foreground">
          Sessions và unique users hoạt động theo ngày
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
          Chưa có dữ liệu
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="h-[320px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 8,
              right: 8,
              top: 8,
              bottom: 8,
            }}
          >
            <CartesianGrid
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={35}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.label
                  }
                />
              }
            />

            <Line
              dataKey="sessions"
              type="monotone"
              stroke="var(--color-sessions)"
              strokeWidth={2}
              dot
              activeDot={{ r: 5 }}
            />

            <Line
              dataKey="users"
              type="monotone"
              stroke="var(--color-users)"
              strokeWidth={2}
              dot
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      )}
    </div>
  );
}