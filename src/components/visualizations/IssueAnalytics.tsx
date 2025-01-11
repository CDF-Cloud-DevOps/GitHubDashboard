import React from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MetricCard } from '../MetricCard';
import { format } from 'date-fns';

interface IssueAnalyticsProps {
  data: {
    monthlyStats: Array<{
      month: string;
      created: number;
      closed: number;
      date: string;
    }>;
  };
   isDaily:boolean;
}

export function IssueAnalytics({ data, isDaily }: IssueAnalyticsProps) {
  if (!data?.monthlyStats?.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="text-blue-600 w-6 h-6" />
          <h2 className="text-xl font-semibold">Issue Analytics</h2>
        </div>
        <p className="text-gray-500 text-center py-8">No issue data available for the selected time range.</p>
      </div>
    );
  }

  const totalIssues = data.monthlyStats.reduce((sum, month) => sum + month.created, 0);
  const totalClosed = data.monthlyStats.reduce((sum, month) => sum + month.closed, 0);
  const closeRate = totalIssues ? Math.round((totalClosed / totalIssues) * 100) : 0;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Activity className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Issue Analytics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Total Issues"
          value={totalIssues}
          icon={AlertCircle}
        />
        <MetricCard
          title="Closed Issues"
          value={totalClosed}
          icon={AlertCircle}
        />
        <MetricCard
          title="Close Rate"
          value={`${closeRate}%`}
          icon={AlertCircle}
        />
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 h-80">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Monthly Issue Trends</h3>
          <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                    if(isDaily){
                        try {
                            return format(new Date(value), 'MMM d');
                        } catch(e) {
                            return value;
                        }
                    } else {
                         const [year, month] = value.split('-');
                         return `${month}/${year.slice(2)}`;
                    }
                }}
            />
              <YAxis />
            <Tooltip
                labelFormatter={(value) => {
                   if(isDaily){
                    try {
                            return format(new Date(value), 'MMM d, yyyy');
                        } catch(e) {
                            return value;
                        }
                    } else {
                        const [year, month] = value.split('-');
                         return `${month}/${year}`;
                    }
                 }}
             />
              <Legend />
              <Line
                type="monotone"
                dataKey="created"
                stroke="#0088FE"
                name="Created"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="closed"
                stroke="#00C49F"
                name="Closed"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
      </div>
    </section>
  );
}