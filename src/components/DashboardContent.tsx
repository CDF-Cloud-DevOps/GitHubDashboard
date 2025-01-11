import React from 'react';
import { IssueAnalytics } from './visualizations/IssueAnalytics';
import { PullRequestMetrics } from './visualizations/PullRequestMetrics';
import { RepositoryHealth } from './visualizations/RepositoryHealth';
import { WorkflowAnalytics } from './visualizations/WorkflowAnalytics';

interface DashboardContentProps {
  data: any;
}

export function DashboardContent({ data }: DashboardContentProps) {
  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      <IssueAnalytics data={data.issues} />
      <PullRequestMetrics data={data.pullRequests} />
      <RepositoryHealth data={data.repositoryHealth} />
      <WorkflowAnalytics data={data.workflows} />
    </div>
  );
}