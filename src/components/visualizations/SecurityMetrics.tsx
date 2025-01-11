import React from 'react';
import { Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#ff4d4f', '#ffa940', '#52c41a'];

interface SecurityMetricsProps {
  data: {
    vulnerabilities: Array<{ severity: string; count: number }>;
    dependencyUpdates: Array<{ status: string; count: number }>;
    scanResults: Array<{ month: string; critical: number; high: number; medium: number }>;
  };
}

export function SecurityMetrics({ data }: SecurityMetricsProps) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Security Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 h-64">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Vulnerability Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.vulnerabilities}
                dataKey="count"
                nameKey="severity"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.vulnerabilities.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 h-64">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Security Scan Trends</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.scanResults}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="critical" stackId="a" fill="#ff4d4f" name="Critical" />
              <Bar dataKey="high" stackId="a" fill="#ffa940" name="High" />
              <Bar dataKey="medium" stackId="a" fill="#52c41a" name="Medium" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}