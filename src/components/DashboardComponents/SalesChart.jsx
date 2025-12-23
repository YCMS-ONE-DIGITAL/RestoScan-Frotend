import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const salesData = [
  { name: "Jan", sales: 1200 },
  { name: "Feb", sales: 900 },
  { name: "Mar", sales: 1400 },
  { name: "Apr", sales: 1000 },
  { name: "May", sales: 1600 },
  { name: "Jun", sales: 1300 },
];

export default function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={salesData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip />
        <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
