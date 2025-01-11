export interface GithubConfig {
  repoUrl: string;
  isPrivate: boolean;
  pat?: string;
}

export interface IssueMetrics {
  yearWiseCount: {
    year: number;
    created: number;
    closed: number;
  }[];
  labelDistribution: {
    label: string;
    count: number;
  }[];
  assigneeBreakdown: {
    assignee: string;
    count: number;
  }[];
  averageTimeToClose: number;
  monthlyTrends: {
    month: string;
    count: number;
  }[];
}

export interface PullRequestMetrics {
  yearWiseStats: {
    year: number;
    opened: number;
    merged: number;
    closed: number;
  }[];
  assigneeContribution: {
    assignee: string;
    count: number;
  }[];
  reviewStats: {
    contributor: string;
    reviewCount: number;
    avgReviewTime: number;
    commentCount: number;
  }[];
  prSizeAnalysis: {
    size: string;
    count: number;
  }[];
}

export interface WorkflowMetrics {
  executionStats: {
    workflow: string;
    runs: number;
    avgRunTime: number;
    successRate: number;
  }[];
  resourceConsumption: {
    workflow: string;
    cpuUsage: number;
    memoryUsage: number;
    cost?: number;
  }[];
}