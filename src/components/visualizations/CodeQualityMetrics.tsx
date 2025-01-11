import React from 'react';
import { Code2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface CodeQualityMetricsProps {
  data: {
    coverage: Array<{ date: string; percentage: number }>;
    complexity: Array<{ component: string; score: number }>;
  };
}

export function CodeQualityMetrics({ data }: CodeQualityMetricsProps) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Code2 className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Code Quality Metrics</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 h-64">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Test Coverage Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.coverage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke="#0088FE" 
                name="Coverage %"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 h-64">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Component Complexity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.complexity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="component" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#FF8042" name="Complexity Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}