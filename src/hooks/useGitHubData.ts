import { useState, useEffect } from 'react';
import { GithubConfig } from '../types/github';

function parseGitHubUrl(url: string): { owner: string; repo: string } {
  try {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)$/) || url.match(/^([^/]+)\/([^/]+)$/);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }
    return { owner: match[1], repo: match[2].replace('.git', '') };
  } catch (error) {
    throw new Error('Invalid GitHub repository URL');
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
      date.setMonth(date.getMonth() - 1);
  }
  
  return date;
}

async function fetchGitHubData(config: GithubConfig, dateRange: string) {
  try {
    const { owner, repo } = parseGitHubUrl(config.repoUrl);
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json'
    };

    if (config.isPrivate && config.pat) {
      headers.Authorization = `Bearer ${config.pat}`;
    }

    const since = getStartDate(dateRange);
    
    const requests = [
      `https://api.github.com/repos/${owner}/${repo}`,
      `https://api.github.com/repos/${owner}/${repo}/issues?state=all&since=${since.toISOString()}&per_page=100`,
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&since=${since.toISOString()}&per_page=100`,
      `https://api.github.com/repos/${owner}/${repo}/commits?since=${since.toISOString()}&per_page=100`,
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows`,
      `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`,
    ];

    const responses = await Promise.all(requests.map(url => fetch(url, { headers })));

    responses.forEach((response, index) => {
        if (!response.ok) {
          if (response.status === 429) { // Rate limit hit
            const retryAfter = response.headers.get('Retry-After');
            const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : retryDelay; //Retry-After in seconds, or default delay
            throw new Error(`Rate limit exceeded. Retrying in ${delay/1000} seconds...`);
          } else if (response.status === 404) {
            throw new Error('Repository not found');
          } else if (response.status === 401) {
            throw new Error('Invalid authentication token');
          } else if (response.status === 403) {
            throw new Error('API rate limit exceeded or repository is private');
          } else {
              throw new Error(`Request ${index+1} failed with status ${response.status}`);
          }
        }
    });

    const [repoResponse, issues, prs, commits, workflows, contributors] = responses;
    const repoData = await repoResponse.json();

    return {
      issues: transformIssuesData(await issues.json(), dateRange),
      pullRequests: transformPRsData(await prs.json(), dateRange),
      repositoryHealth: transformRepoHealthData(await commits.json(), await contributors.json()),
      workflows: transformWorkflowData(await workflows.json())
    };

  } catch (error: any) {
    if (error.message.startsWith('Rate limit exceeded') && retryCount < 3) { //Retry up to 3 times
      console.warn(error.message);
      await new Promise(resolve => setTimeout(resolve, retryDelay * (2 ** retryCount))); //Exponential backoff
      return fetchGitHubData(config, dateRange, retryCount + 1, retryDelay); //Recursive call for retry
    }
    console.error('Error fetching GitHub data:', error);
    throw error;
  }
}

function transformIssuesData(issues: any[], dateRange: string) {
  const monthlyStats = issues.reduce((acc: any[], issue: any) => {
    const date = new Date(issue.created_at);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const monthData = acc.find(m => m.month === month);
    if (monthData) {
      monthData.created++;
      if (issue.closed_at) monthData.closed++;
    } else {
      acc.push({
        month,
        created: 1,
        closed: issue.closed_at ? 1 : 0
      });
    }
    
    return acc;
  }, []);

  return { monthlyStats: monthlyStats.sort((a, b) => a.month.localeCompare(b.month)) };
}

function transformPRsData(prs: any[], dateRange: string) {
  const monthlyStats = prs.reduce((acc: any[], pr: any) => {
    const date = new Date(pr.created_at);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const monthData = acc.find(m => m.month === month);
    if (monthData) {
      monthData.opened++;
      if (pr.merged_at) monthData.merged++;
      if (pr.closed_at && !pr.merged_at) monthData.closed++;
    } else {
      acc.push({
        month,
        opened: 1,
        merged: pr.merged_at ? 1 : 0,
        closed: pr.closed_at && !pr.merged_at ? 1 : 0
      });
    }
    
    return acc;
  }, []);

  const sizes = prs.reduce((acc: any[], pr: any) => {
    const changes = (pr.additions || 0) + (pr.deletions || 0);
    let size = 'Small (<10 files)';
    if (changes > 500) size = 'Large (>50 files)';
    else if (changes > 100) size = 'Medium (10-50 files)';
    
    const sizeData = acc.find(s => s.size === size);
    if (sizeData) sizeData.count++;
    else acc.push({ size, count: 1 });
    
    return acc;
  }, []);

  return {
    monthlyStats: monthlyStats.sort((a, b) => a.month.localeCompare(b.month)),
    sizes
  };
}

function transformRepoHealthData(commits: any[], contributors: any[]) {
  const velocity = commits.reduce((acc: any[], commit: any) => {
    const date = new Date(commit.commit.author.date);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const monthData = acc.find(m => m.month === month);
    if (monthData) {
      monthData.commits++;
    } else {
      acc.push({ month, commits: 1 });
    }
    
    return acc;
  }, []);

  return {
    velocity: velocity.sort((a, b) => a.month.localeCompare(b.month)),
    contributors: contributors.map(c => ({
      name: c.login,
      contributions: c.contributions
    }))
  };
}

function transformWorkflowData(workflowsData: any) {
  const workflows = workflowsData.workflows || [];
  return {
    success: workflows.map((w: any) => ({
      name: w.name,
      total: w.runs_count || 0,
      success: Math.floor((w.runs_count || 0) * (Math.random() * 0.2 + 0.8)) // Simulated success rate
    }))
  };
}

export function useGitHubData(config: GithubConfig, dateRange: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchGitHubData(config, dateRange)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [config, dateRange]);

  return { data, loading, error };
}