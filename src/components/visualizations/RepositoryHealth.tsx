import React from 'react';
import { LineChartIcon, Users, GitCommit } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MetricCard } from '../MetricCard';

interface RepositoryHealthProps {
  data: {
    velocity: Array<{ month: string; commits: number }>;
    contributors: Array<{ name: string; contributions: number }>;
  };
}

export function RepositoryHealth({ data }: RepositoryHealthProps) {
  if (!data?.velocity?.length) {
    return null;
  }

  const totalCommits = data.velocity.reduce((sum, month) => sum + month.commits, 0);
  const avgCommitsPerMonth = Math.round(totalCommits / data.velocity.length);
  const totalContributors = data.contributors.length;

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <LineChartIcon className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Repository Health</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Total Commits"
          value={totalCommits}
          icon={GitCommit}
        />
        <MetricCard
          title="Avg Commits/Month"
          value={avgCommitsPerMonth}
          icon={GitCommit}
        />
        <MetricCard
          title="Active Contributors"
          value={totalContributors}
          icon={Users}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 h-80">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Commit Activity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.velocity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
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
              <Area 
                type="monotone" 
                dataKey="commits" 
                fill="#0088FE" 
                stroke="#0088FE" 
                name="Commits"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 h-80">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Top Contributors</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.contributors} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 12)}...` : value}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="contributions" fill="#00C49F" name="Contributions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}