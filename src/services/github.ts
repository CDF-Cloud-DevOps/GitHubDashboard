import { GithubConfig } from '../types/github';
import { mockDashboardData } from '../data/mockData';

const GITHUB_API_BASE = 'https://api.github.com';

export async function fetchGitHubData(config: GithubConfig, dateRange: string) {
  const [owner, repo] = config.repoUrl.split('/').slice(-2);
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json'
  };

  if (config.isPrivate && config.pat) {
    headers.Authorization = `Bearer ${config.pat}`;
  }

  const since = getStartDate(dateRange);
  
  try {
    // Fetch issues
    const issuesResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=all&since=${since.toISOString()}`,
      { headers }
    );
    
    if (!issuesResponse.ok) {
      throw new Error('Failed to fetch repository data');
    }

    const issues = await issuesResponse.json();
    
    // Transform the data
    return transformGitHubData(issues, dateRange);
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    throw new Error('Failed to fetch repository data');
  }
}

function getStartDate(dateRange: string): Date {
  const date = new Date();
  
  switch (dateRange) {
    case '1m':
      date.setMonth(date.getMonth() - 1);
      break;
    case '3m':
      date.setMonth(date.getMonth() - 3);
      break;
    case '6m':
      date.setMonth(date.getMonth() - 6);
      break;
    case '1y':
      date.setFullYear(date.getFullYear() - 1);
      break;
    case '3y':
      date.setFullYear(date.getFullYear() - 3);
      break;
    default:
      date.setMonth(date.getMonth() - 1); // Default to last month
  }
  
  return date;
}

function transformGitHubData(issues: any[], dateRange: string) {
  // Group issues by year and month
  const issuesByYear = issues.reduce((acc: any, issue: any) => {
    const date = new Date(issue.created_at);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    if (!acc[year]) {
      acc[year] = { created: 0, closed: 0 };
    }
    
    acc[year].created++;
    if (issue.closed_at) {
      acc[year].closed++;
    }
    
    return acc;
  }, {});

  // Transform data to match the expected format
  return {
    issues: {
      yearWise: Object.entries(issuesByYear).map(([year, data]: [string, any]) => ({
        year: parseInt(year),
        created: data.created,
        closed: data.closed
      })),
      // Add other metrics with real data as needed
      ...mockDashboardData.issues
    },
    // Keep other sections from mock data for now
    pullRequests: mockDashboardData.pullRequests,
    repositoryHealth: mockDashboardData.repositoryHealth,
    workflows: mockDashboardData.workflows
  };
}