import React from 'react';
import { GitPullRequest, GitMerge, GitBranch } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MetricCard } from '../MetricCard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface PullRequestMetricsProps {
  data: {
    monthlyStats: Array<{
      month: string;
      opened: number;
      merged: number;
      closed: number;
       date:string;
    }>;
    sizes: Array<{
      size: string;
      count: number;
    }>;
  };
}

export function PullRequestMetrics({ data }: PullRequestMetricsProps) {
  if (!data?.monthlyStats?.length) {
    return null;
  }

  const totalPRs = data.monthlyStats.reduce((sum, month) => sum + month.opened, 0);
  const totalMerged = data.monthlyStats.reduce((sum, month) => sum + month.merged, 0);
  const mergeRate = totalPRs ? Math.round((totalMerged / totalPRs) * 100) : 0;

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <GitPullRequest className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Pull Request Metrics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Total PRs"
          value={totalPRs}
          icon={GitBranch}
        />
        <MetricCard
          title="Merged PRs"
          value={totalMerged}
          icon={GitMerge}
        />
        <MetricCard
          title="Merge Rate"
          value={`${mergeRate}%`}
          icon={GitPullRequest}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 h-80">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Monthly PR Activity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-');
                    return `${month}/${year.slice(2)}`;
                  }}
              />
              <YAxis />
             <Tooltip 
                  labelFormatter={(value) => {
                    const [year, month] = value.split('-');
                    return `${month}/${year}`;
                  }}
                />
              <Legend />
              <Line type="monotone" dataKey="opened" stroke="#0088FE" name="Opened" strokeWidth={2} />
              <Line type="monotone" dataKey="merged" stroke="#00C49F" name="Merged" strokeWidth={2} />
              <Line type="monotone" dataKey="closed" stroke="#FF8042" name="Closed" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 h-80">
          <h3 className="text-sm font-medium text-gray-700 mb-4">PR Size Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.sizes}
                dataKey="count"
                nameKey="size"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {data.sizes.map((_, index) => (
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