import React from 'react';
import { PlayCircle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MetricCard } from '../MetricCard';

interface WorkflowAnalyticsProps {
  data: {
    success: Array<{
      name: string;
      total: number;
      success: number;
    }>;
  };
}

export function WorkflowAnalytics({ data }: WorkflowAnalyticsProps) {
  if (!data?.success?.length) {
    return null;
  }

  const totalRuns = data.success.reduce((sum, workflow) => sum + workflow.total, 0);
  const totalSuccess = data.success.reduce((sum, workflow) => sum + workflow.success, 0);
  const successRate = totalRuns ? Math.round((totalSuccess / totalRuns) * 100) : 0;

  const chartData = data.success.map(workflow => ({
    name: workflow.name,
    successRate: workflow.total ? Math.round((workflow.success / workflow.total) * 100) : 0,
    total: workflow.total
  }));

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <PlayCircle className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">GitHub Actions Analysis</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Total Workflow Runs"
          value={totalRuns}
          icon={PlayCircle}
        />
        <MetricCard
          title="Successful Runs"
          value={totalSuccess}
          icon={CheckCircle2}
        />
        <MetricCard
          title="Overall Success Rate"
          value={`${successRate}%`}
          icon={CheckCircle2}
        />
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 h-80">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Workflow Success Rates</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              tickFormatter={(value) => value.length > 20 ? `${value.slice(0, 17)}...` : value}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="successRate" 
              fill="#00C49F" 
              name="Success Rate (%)"
              label={{ position: 'top', formatter: (value: number) => `${value}%` }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}