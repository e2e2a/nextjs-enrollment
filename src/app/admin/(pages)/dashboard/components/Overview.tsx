'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface IProps {
  users: any
}
export function Overview({users}: IProps) {
  console.log(users);
  const data = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
    { name: 'Jul', total: 0 },
    { name: 'Aug', total: 0 },
    { name: 'Sep', total: 0 },
    { name: 'Oct', total: 0 },
    { name: 'Nov', total: 0 },
    { name: 'Dec', total: 0 },
  ];
  if (users && users.length > 0) {
    const currentYear = new Date().getFullYear();
    users.forEach((user: any) => {
      const userDate = new Date(user.createdAt);
      const monthIndex = userDate.getMonth(); // Get month index (0-11)

      // Check if the year matches the current year
      if (userDate.getFullYear() === currentYear) {
        data[monthIndex].total += 1; // Increment the total for that month
      }
    });
  }
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
