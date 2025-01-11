import React from 'react';
import { Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d'];

interface DependencyAnalyticsProps {
  data: {
    outdated: Array<{ type: string; count: number }>;
    updates: Array<{ month: string; major: number; minor: number; patch: number }>;
  };
}

export function DependencyAnalytics({ data }: DependencyAnalyticsProps) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Dependency Health</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 h-64">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Outdated Dependencies</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.outdated}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.outdated.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 h-64">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Update History</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.updates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="major" fill="#f5222d" name="Major" />
              <Bar dataKey="minor" fill="#faad14" name="Minor" />
              <Bar dataKey="patch" fill="#52c41a" name="Patch" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}