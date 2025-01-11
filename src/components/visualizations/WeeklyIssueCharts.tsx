import React from 'react';
import { Activity, AlertCircle, User, Tag } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MetricCard } from '../MetricCard';
import { format } from 'date-fns';

interface WeeklyIssueChartsProps {
    weeklyStats: Array<{
        week: string;
        created: number;
        closed: number;
        date: string;
    }>;
    assigneeStats:Array<{
        name:string;
        assigned:number;
        resolved:number;
    }>;
     labelStats:Array<{
       name:string,
       created:number;
       closed:number;
    }>
}

export function WeeklyIssueCharts({ weeklyStats, assigneeStats, labelStats }: WeeklyIssueChartsProps) {
    if (!weeklyStats) {
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

    const totalIssues = weeklyStats.reduce((sum, week) => sum + week.created, 0);
    const totalClosed = weeklyStats.reduce((sum, week) => sum + week.closed, 0);
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4 h-80">
                   <h3 className="text-sm font-medium text-gray-700 mb-4">Weekly Issue Trends</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                         <XAxis
                            dataKey="date"
                           tickFormatter={(value) => {
                                 try {
                                     return format(new Date(value), 'MMM d');
                                 } catch(e) {
                                     return value;
                                 }
                             }}
                        />
                      <YAxis />
                        <Tooltip
                            labelFormatter={(value) => {
                                try {
                                     return format(new Date(value), 'MMM d, yyyy');
                                 } catch(e) {
                                     return value;
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
                <div className="bg-gray-50 rounded-lg p-4 h-80">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Assignee Breakdown</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={assigneeStats} layout="vertical">
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
                            <Bar dataKey="assigned" fill="#0088FE" name="Assigned" />
                            <Bar dataKey="resolved" fill="#00C49F" name="Resolved" />
                       </BarChart>
                     </ResponsiveContainer>
                 </div>
           </div>
            <div className="bg-gray-50 rounded-lg p-4 h-80">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Label Trends</h3>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={labelStats} layout="vertical">
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
                     <Bar dataKey="created" fill="#0088FE" name="Created" />
                    <Bar dataKey="closed" fill="#00C49F" name="Closed" />
                  </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}