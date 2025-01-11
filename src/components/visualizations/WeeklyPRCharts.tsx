import React from 'react';
import { GitPullRequest, GitMerge, GitBranch, User, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MetricCard } from '../MetricCard';
import { format } from 'date-fns';

interface WeeklyPRChartsProps {
    weeklyStats: Array<{
        week: string;
        opened: number;
        merged: number;
        closed: number;
         date:string;
    }>;
    authorStats:Array<{
        name:string,
        opened:number;
        merged:number;
       closed:number;
    }>;
     waitingPRs:Array<{
         id:string,
        title:string,
        author:string,
        created_at:string;
         url:string;
         age:number
     }>,
     labelStats:Array<{
      name:string,
       opened:number;
        merged:number;
       closed:number;
    }>,
    reviewerStats:Array<{
        name:string;
       reviewed:number;
       comments:number;
    }>
}

export function WeeklyPRCharts({ weeklyStats, authorStats, waitingPRs, labelStats, reviewerStats }: WeeklyPRChartsProps) {
   if (!weeklyStats) {
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <GitPullRequest className="text-blue-600 w-6 h-6" />
              <h2 className="text-xl font-semibold">Pull Request Metrics</h2>
            </div>
            <p className="text-gray-500 text-center py-8">No PR data available for the selected time range.</p>
          </div>
        );
   }
        const totalPRs = weeklyStats.reduce((sum, week) => sum + week.opened, 0);
        const totalMerged = weeklyStats.reduce((sum, week) => sum + week.merged, 0);
        const mergeRate = totalPRs ? Math.round((totalMerged / totalPRs) * 100) : 0;

    return (
       <section>
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
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Weekly PR Activity</h3>
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
                          <Line type="monotone" dataKey="opened" stroke="#0088FE" name="Opened" strokeWidth={2} />
                          <Line type="monotone" dataKey="merged" stroke="#00C49F" name="Merged" strokeWidth={2} />
                          <Line type="monotone" dataKey="closed" stroke="#FF8042" name="Closed" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
               <div className="bg-gray-50 rounded-lg p-4 h-80">
                 <h3 className="text-sm font-medium text-gray-700 mb-4">PR Author Contribution</h3>
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={authorStats} layout="vertical">
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
                         <Bar dataKey="opened" fill="#0088FE" name="Opened" />
                          <Bar dataKey="merged" fill="#00C49F" name="Merged" />
                         <Bar dataKey="closed" fill="#FF8042" name="Closed" />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
           </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-gray-50 rounded-lg p-4 h-80">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">PR Label Trends</h3>
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
                           <Bar dataKey="opened" fill="#0088FE" name="Opened" />
                           <Bar dataKey="merged" fill="#00C49F" name="Merged" />
                           <Bar dataKey="closed" fill="#FF8042" name="Closed" />
                          </BarChart>
                       </ResponsiveContainer>
                   </div>
                <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Long Waiting PRs</h3>
                    {waitingPRs.length === 0 ?
                            <p className="text-gray-500 text-center py-8">No long waiting PR</p>
                            :
                            <ul className="space-y-2">
                            {waitingPRs.map(pr => (
                                <li key={pr.id} className="p-3 bg-white rounded-md shadow-sm hover:shadow-md">
                                 <a href={pr.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                                   <span className="font-medium">{pr.title}</span>
                                 </a>
                                 <p className="text-gray-600 text-sm">
                                        Author: <span className="font-medium">{pr.author}</span>,
                                         Age: <span className="font-medium">{pr.age.toFixed(1)} days</span>
                                  </p>
                               </li>
                             ))}
                           </ul>
                  }
                 </div>
             </div>
             <div className="bg-gray-50 rounded-lg p-4 h-80">
                 <h3 className="text-sm font-medium text-gray-700 mb-4">Reviewer Activity</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reviewerStats} layout="vertical">
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
                        <Bar dataKey="reviewed" fill="#0088FE" name="Reviewed" />
                        <Bar dataKey="comments" fill="#00C49F" name="Comments" />
                   </BarChart>
                </ResponsiveContainer>
             </div>
        </section>
    );
}