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
  UserGrowthByDay,
} from '../types/admin-dashboard.types';

interface Props {
  data: UserGrowthByDay[];
}

const chartConfig = {
  registrations: {
    label: 'Đăng ký',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function UserRegistrationChart({
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
    registrations: item.count,
  }));

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          User registrations
        </h2>

        <p className="text-sm text-muted-foreground">
          Số lượng tài khoản đăng ký theo ngày
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
              dataKey="registrations"
              type="monotone"
              stroke="var(--color-registrations)"
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