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
        case '1d':
            date.setDate(date.getDate() - 1);
            break;
        case '2d':
            date.setDate(date.getDate() - 2);
            break;
        case '3d':
            date.setDate(date.getDate() - 3);
            break;
        case '1w':
            date.setDate(date.getDate() - 7);
            break;
        case '2w':
            date.setDate(date.getDate() - 14);
            break;
        case '3w':
            date.setDate(date.getDate() - 21);
            break;
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

async function fetchGitHubData(config: GithubConfig, dateRange: string, retryCount = 0, retryDelay = 1000) {
    try {
        const { owner, repo } = parseGitHubUrl(config.repoUrl);
        const headers: HeadersInit = {
            'Accept': 'application/vnd.github.v3+json'
        };

        if (config.isPrivate && config.pat) {
            headers.Authorization = `Bearer ${config.pat}`;
        }

        const since = getStartDate(dateRange);
        const sinceString = since.toISOString();

        const fetchAllPages = async (url: string, accumulatedData: any[] = []): Promise<any[]> => {
            try {
                const response = await fetch(url, { headers });

                if (!response.ok) {
                    if (response.status === 429) {
                        const retryAfter = response.headers.get('Retry-After');
                        const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : retryDelay;
                        throw new Error(`Rate limit exceeded. Retrying in ${delay / 1000} seconds...`);
                    } else {
                        throw new Error(`Failed to fetch data with status ${response.status} from ${url}`);
                    }
                }

                const data = await response.json();
                const allData = [...accumulatedData, ...data];

                const linkHeader = response.headers.get('Link');
                if (linkHeader) {
                    const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
                    if (nextMatch) {
                        const nextUrl = nextMatch[1];
                        return fetchAllPages(nextUrl, allData);
                    }
                }
                return allData;
            } catch (error: any) {
                if (error.message.startsWith('Rate limit exceeded') && retryCount < 3) {
                    console.warn(error.message);
                    await new Promise(resolve => setTimeout(resolve, retryDelay * (2 ** retryCount)));
                    return fetchAllPages(url, accumulatedData); // Retry fetching the current page
                }
                throw error;
            }
        };

        const issuesUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=all&since=${sinceString}&per_page=100`;
        const pullsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&since=${sinceString}&per_page=100`;
        const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/commits?since=${sinceString}&per_page=100`;
        const contributorsUrl = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`;
        const workflowsUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows?per_page=100`;

        const [issues, allPRs, commits, contributors, workflowsData] = await Promise.all([
            fetchAllPages(issuesUrl),
            fetchAllPages(pullsUrl),
            fetchAllPages(commitsUrl),
            fetchAllPages(contributorsUrl),
            fetchAllPages(workflowsUrl),
        ]);

        const workflows = workflowsData || [];
        const workflowRunsPromises = workflows.map(async (workflow: any) => {
            const runsUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow.id}/runs?per_page=100&since=${sinceString}`;
            const runsResponse = await fetchAllPages(runsUrl);
            return {
                workflowName: workflow.name,
                runs: runsResponse,
            };
        });
        const workflowRuns = await Promise.all(workflowRunsPromises);

        const prReviewsPromises = allPRs.map(async (pr: any) => {
            const reviewsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/reviews?per_page=100`;
            try {
                const reviews = await fetchAllPages(reviewsUrl);
                return { prNumber: pr.number, reviews };
            } catch (error) {
                console.warn(`Failed to fetch reviews for PR ${pr.number}:`, error);
                return { prNumber: pr.number, reviews: [] };
            }
        });
        const prReviews = await Promise.all(prReviewsPromises);

        return {
            issues: transformIssuesData(issues, dateRange),
            pullRequests: transformPRsData(allPRs, dateRange, prReviews),
            repositoryHealth: transformRepoHealthData(commits, contributors),
            workflows: transformWorkflowData(workflowRuns)
        };

    } catch (error: any) {
        if (error.message.startsWith('Rate limit exceeded') && retryCount < 3) {
            console.warn(error.message);
            await new Promise(resolve => setTimeout(resolve, retryDelay * (2 ** retryCount)));
            return fetchGitHubData(config, dateRange, retryCount + 1, retryDelay);
        }
        console.error('Error fetching GitHub data:', error);
        throw error;
    }
}

// ... (rest of the transform functions remain the same)
function transformIssuesData(issues: any[], dateRange: string) {
    // ... (rest of the transformIssuesData function remains the same)
    const monthlyStats = issues.reduce((acc: any[], issue: any) => {
        const date = new Date(issue.created_at);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthData = acc.find(m => m.month === month);
        if (monthData) {
            monthData.created++;
            if (issue.closed_at) monthData.closed++;
        } else {
            acc.push({ month, created: 1, closed: issue.closed_at ? 1 : 0, date: date.toISOString() });
        }
        return acc;
    }, []);
    const weeklyStats = issues.reduce((acc: any[], issue: any) => {
        const date = new Date(issue.created_at);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
        const weekData = acc.find(w => w.week === weekKey);
        if (weekData) {
            weekData.created++;
            if (issue.closed_at) {
                weekData.closed++;
            }
        } else {
            acc.push({ week: weekKey, created: 1, closed: issue.closed_at ? 1 : 0, date: weekStart.toISOString() });
        }
        return acc;
    }, []);
    const assigneeStats = issues.reduce((acc: any[], issue: any) => {
        if (issue.assignees) {
            issue.assignees.forEach((assignee: any) => {
                const assigneeData = acc.find((a: any) => a.name === assignee.login);
                if (assigneeData) {
                    assigneeData.assigned++;
                    if (issue.closed_at) {
                        assigneeData.resolved++;
                    }
                } else {
                    acc.push({ name: assignee.login, assigned: 1, resolved: issue.closed_at ? 1 : 0 });
                }
            });
        }
        return acc;
    }, []);
    const labelStats = issues.reduce((acc: any[], issue: any) => {
        if (issue.labels) {
            issue.labels.forEach((label: any) => {
                const labelData = acc.find((l: any) => l.name === label.name);
                if (labelData) {
                    labelData.created++;
                    if (issue.closed_at) {
                        labelData.closed++;
                    }
                } else {
                    acc.push({ name: label.name, created: 1, closed: issue.closed_at ? 1 : 0 });
                }
            });
        }
        return acc;
    }, []);
    return {
        monthlyStats: monthlyStats.sort((a, b) => a.month.localeCompare(b.month)).map(item => ({ ...item })),
        weeklyStats: weeklyStats.sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime()).map(item => ({ ...item })),
        assigneeStats,
        labelStats
    };
}

function transformPRsData(prs: any[], dateRange: string, prReviews: any[]) {
    // ... (rest of the transformPRsData function remains the same)
    const monthlyStats = prs.reduce((acc: any[], pr: any) => {
        const date = new Date(pr.created_at);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthData = acc.find(m => m.month === month);
        if (monthData) {
            monthData.opened++;
            if (pr.merged_at) monthData.merged++;
            if (pr.closed_at && !pr.merged_at) monthData.closed++;
        } else {
            acc.push({ month, opened: 1, merged: pr.merged_at ? 1 : 0, closed: pr.closed_at && !pr.merged_at ? 1 : 0, date: date.toISOString() });
        }
        return acc;
    }, []);
    const weeklyStats = prs.reduce((acc: any[], pr: any) => {
        const date = new Date(pr.created_at);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
        const weekData = acc.find(w => w.week === weekKey);
        if (weekData) {
            weekData.opened++;
            if (pr.merged_at) {
                weekData.merged++;
            }
            if (pr.closed_at && !pr.merged_at) weekData.closed++;
        } else {
            acc.push({ week: weekKey, opened: 1, merged: pr.merged_at ? 1 : 0, closed: pr.closed_at && !pr.merged_at ? 1 : 0, date: weekStart.toISOString() });
        }
        return acc;
    }, []);
    const authorStats = prs.reduce((acc: any[], pr: any) => {
        const authorData = acc.find((a: any) => a.name === pr.user.login);
        if (authorData) {
            authorData.opened++;
            if (pr.merged_at) {
                authorData.merged++;
            }
            if (pr.closed_at && !pr.merged_at) authorData.closed++;
        } else {
            acc.push({ name: pr.user.login, opened: 1, merged: pr.merged_at ? 1 : 0, closed: pr.closed_at && !pr.merged_at ? 1 : 0 });
        }
        return acc;
    }, []);
    const waitingPRs = prs.filter(pr => !pr.merged_at && !pr.closed_at).map(pr => ({
        id: pr.id,
        title: pr.title,
        author: pr.user.login,
        created_at: pr.created_at,
        url: pr.html_url,
        age: (new Date().getTime() - new Date(pr.created_at).getTime()) / (1000 * 60 * 60 * 24)
    }));
    const labelStats = prs.reduce((acc: any[], pr: any) => {
        if (pr.labels) {
            pr.labels.forEach((label: any) => {
                const labelData = acc.find((l: any) => l.name === label.name);
                if (labelData) {
                    labelData.opened++;
                    if (pr.merged_at) {
                        labelData.merged++;
                    }
                    if (pr.closed_at && !pr.merged_at) labelData.closed++;
                } else {
                    acc.push({ name: label.name, opened: 1, merged: pr.merged_at ? 1 : 0, closed: pr.closed_at && !pr.merged_at ? 1 : 0 });
                }
            });
        }
        return acc;
    }, []);
    const reviewerStats = prReviews.reduce((acc: any[], pr: any) => {
        if (pr.reviews) {
            pr.reviews.forEach((review: any) => {
                const reviewerData = acc.find((r: any) => r.name === review.user.login);
                if (reviewerData) {
                    reviewerData.reviewed++;
                    reviewerData.comments += review.body ? review.body.length : 0;
                } else {
                    acc.push({ name: review.user.login, reviewed: 1, comments: review.body ? review.body.length : 0 });
                }
            });
        }
        return acc;
    }, []);
    return {
        monthlyStats: monthlyStats.sort((a, b) => a.month.localeCompare(b.month)).map(item => ({ ...item })),
        weeklyStats: weeklyStats.sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime()).map(item => ({ ...item })),
        authorStats,
        waitingPRs,
        labelStats,
        reviewerStats,
        sizes: prs.reduce((acc: any[], pr: any) => {
            const changes = (pr.additions || 0) + (pr.deletions || 0);
            let size = 'Small (<10 files)';
            if (changes > 500) size = 'Large (>50 files)';
            else if (changes > 100) size = 'Medium (10-50 files)';
            const sizeData = acc.find(s => s.size === size);
            if (sizeData) sizeData.count++;
            else acc.push({ size, count: 1 });
            return acc;
        }, [])
    };
}

function transformRepoHealthData(commits: any[], contributors: any[]) {
    // ... (rest of the transformRepoHealthData function remains the same)
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

function transformWorkflowData(workflowRuns: { workflowName: string, runs: any }[]) {
    // ... (rest of the transformWorkflowData function remains the same)
    return {
        success: workflowRuns.map(({ workflowName, runs }: any) => {
            const totalRuns = runs?.length || 0; // Access runs directly, it's already the array of runs
            const successfulRuns = runs?.filter((run: any) => run.conclusion === 'success').length || 0;

            return {
                name: workflowName,
                total: totalRuns,
                success: successfulRuns,
            };
        }),
    };
}

export function useGitHubData(config: GithubConfig, dateRange: string) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState<string | null>('Loading repository data...');
    const [error, setError] = useState<string | null>(null);
    const [cache, setCache] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setLoadingMessage('Loading repository data...');
            setError(null);

            const cacheKey = `github-data-${config.repoUrl}-${dateRange}`;
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                setData(JSON.parse(cachedData));
                setLoading(false);
                return;
            }

            try {
                const apiData = await fetchGitHubData(config, dateRange);
                setData(apiData);
                localStorage.setItem(cacheKey, JSON.stringify(apiData));
                setCache(apiData);
            } catch (err: any) {
                setError(err.message === 'Failed to fetch data' ? 'Failed to fetch repository data. Please check your configuration and network connection.' : err.message);
            } finally {
                setLoading(false);
                setLoadingMessage(null);
            }
        };

        fetchData();
    }, [config, dateRange]);

    return { data, loading, error, loadingMessage };
}