import React from 'react';
import { Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface TeamProductivityProps {
  data: {
    velocity: Array<{ sprint: string; points: number }>;
    contribution: Array<{ team: string; commits: number }>;
  };
}

export function TeamProductivity({ data }: TeamProductivityProps) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Team Productivity</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 h-64">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Sprint Velocity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.velocity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sprint" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="points" 
                fill="#0088FE" 
                stroke="#0088FE" 
                name="Story Points"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 h-64">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Team Contribution Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.contribution}
                dataKey="commits"
                nameKey="team"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.contribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}