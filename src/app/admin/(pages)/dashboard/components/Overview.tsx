'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
const myinfo = [
  {
    user: 1,
  },
  {
    user: 2,
  },
];
const data = [
  {
    name: 'Jan',
    total: 2 + 1000,
  },
  {
    name: 'Feb',
    total: myinfo.length ,
  },
  {
    name: 'Mar',
    total:  1000,
  },
  {
    name: 'Apr',
    total:  1000,
  },
  {
    name: 'May',
    total:  0,
  },
  {
    name: 'Jun',
    total: 0,
  },
  {
    name: 'Jul',
    total:  0,
  },
  {
    name: 'Aug',
    total:  0,
  },
  {
    name: 'Sep',
    total:  0,
  },
  {
    name: 'Oct',
    total:  0,
  },
  {
    name: 'Nov',
    total:  0,
  },
  {
    name: 'Dec',
    total:  0,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis dataKey='name' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey='total' fill='currentColor' radius={[4, 4, 0, 0]} className='fill-primary' />
      </BarChart>
    </ResponsiveContainer>
  );
}
