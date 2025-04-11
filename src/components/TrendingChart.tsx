
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';

// Mock data for the chart
const data = [
  { time: '00:00', price: 0.0015 },
  { time: '04:00', price: 0.0016 },
  { time: '08:00', price: 0.0014 },
  { time: '12:00', price: 0.0018 },
  { time: '16:00', price: 0.0016 },
  { time: '20:00', price: 0.0019 },
  { time: '24:00', price: 0.0021 },
];

const TrendingChart = () => {
  return (
    <ChartContainer
      config={{
        price: {
          theme: {
            light: '#22c55e',
            dark: '#22c55e',
          },
        },
      }}
      className="h-full"
    >
      <AreaChart
        data={data}
        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={30}
          tick={{ fill: '#888', fontSize: 10 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `${value.toFixed(4)}`}
          tick={{ fill: '#888', fontSize: 10 }}
          domain={['dataMin - 0.0001', 'dataMax + 0.0001']}
        />
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value: number) => [`${value.toFixed(4)} TON`, 'Price']}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#22c55e"
          fillOpacity={1}
          fill="url(#colorPrice)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default TrendingChart;
