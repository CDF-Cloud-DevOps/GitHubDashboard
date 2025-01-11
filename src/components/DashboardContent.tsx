import React from 'react';
import { IssueAnalytics } from './visualizations/IssueAnalytics';
import { PullRequestMetrics } from './visualizations/PullRequestMetrics';
import { RepositoryHealth } from './visualizations/RepositoryHealth';
import { WorkflowAnalytics } from './visualizations/WorkflowAnalytics';
import { GranularChartTabs } from '../components/GranularChartTabs';
import { WeeklyIssueCharts } from './visualizations/WeeklyIssueCharts';
import { WeeklyPRCharts } from './visualizations/WeeklyPRCharts';

interface DashboardContentProps {
    data: any;
    dateRange:string;
    dashboardConfig:any;
}

export function DashboardContent({ data, dateRange, dashboardConfig }: DashboardContentProps) {
    if (!data) {
        return null;
    }
    const isDailyRange = ['1d', '2d', '3d', '1w', '2w', '3w'].includes(dateRange);

    return (
        <div className="space-y-8">
           {dashboardConfig.metrics.includes('issues') &&
                <GranularChartTabs
                    monthlyContent={<IssueAnalytics data={data.issues} isDaily={false}/>}
                    dailyContent={<WeeklyIssueCharts weeklyStats={data.issues.weeklyStats} assigneeStats={data.issues.assigneeStats} labelStats={data.issues.labelStats}/>}
                    tab1Name={"Detailed View"}
                    tab2Name={"Overview"}
                />
           }
           {dashboardConfig.metrics.includes('pullRequests') &&
               <GranularChartTabs
                     monthlyContent={<PullRequestMetrics data={data.pullRequests} isDaily={false}/>}
                    dailyContent={<WeeklyPRCharts weeklyStats={data.pullRequests.weeklyStats} authorStats={data.pullRequests.authorStats} waitingPRs={data.pullRequests.waitingPRs} labelStats={data.pullRequests.labelStats} reviewerStats={data.pullRequests.reviewerStats} />}
                    tab1Name={"Detailed View"}
                    tab2Name={"Overview"}
               />
            }
           {dashboardConfig.metrics.includes('repositoryHealth') &&
               <RepositoryHealth data={data.repositoryHealth} />
           }
            {dashboardConfig.metrics.includes('workflows') &&
                <WorkflowAnalytics data={data.workflows} />
            }

        </div>
    );
}