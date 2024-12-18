"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { Card } from "@/components/ui/card";

interface ChartProps {
  data: {
    name: string;
    total: number;
  }[];
}

export default function Chart({ data }: ChartProps) {
  return (
    <div className="w-full h-full">
      {data.length === 0 ? (
        <div className="text-slate-500 flex items-center justify-center pt-8">
          Any course has not been purchased yet
        </div>
      ) : (
        <Card className="bg-blue-50">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart width={500} height={350} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="reb" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#369a1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}
