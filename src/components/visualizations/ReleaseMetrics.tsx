import React from 'react';
import { Tag } from 'lucide-react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReleaseMetricsProps {
  data: {
    releases: Array<{
      version: string;
      bugs: number;
      features: number;
      deploymentTime: number;
    }>;
  };
}

export function ReleaseMetrics({ data }: ReleaseMetricsProps) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Tag className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Release Analytics</h2>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 h-64">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Release Composition & Deployment Time</h3>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.releases}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="version" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="bugs" fill="#FF8042" name="Bugs Fixed" />
            <Bar yAxisId="left" dataKey="features" fill="#0088FE" name="New Features" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="deploymentTime"
              stroke="#00C49F"
              name="Deployment Time (min)"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}