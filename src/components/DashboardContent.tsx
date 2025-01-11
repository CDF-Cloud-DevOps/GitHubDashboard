import React from 'react';
import { IssueAnalytics } from './visualizations/IssueAnalytics';
import { PullRequestMetrics } from './visualizations/PullRequestMetrics';
import { RepositoryHealth } from './visualizations/RepositoryHealth';
import { WorkflowAnalytics } from './visualizations/WorkflowAnalytics';
import { GranularChartTabs } from './GranularChartTabs';

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
                   dailyContent={<>
                       <IssueAnalytics data={data.issues} isDaily={isDailyRange}/>
                   </>}
                   monthlyContent={<>
                       <IssueAnalytics data={data.issues} isDaily={false}/>
                   </>}
               />
           }
           {dashboardConfig.metrics.includes('pullRequests') &&
               <GranularChartTabs
                   dailyContent={<>
                       <PullRequestMetrics data={data.pullRequests} isDaily={isDailyRange}/>
                   </>}
                   monthlyContent={<>
                       <PullRequestMetrics data={data.pullRequests} isDaily={false}/>
                   </>}
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