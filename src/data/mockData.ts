// Mock data for demonstration
export const mockDashboardData = {
  issues: {
    yearWise: [
      { year: 2023, created: 245, closed: 220 },
      { year: 2022, created: 189, closed: 175 },
      { year: 2021, created: 133, closed: 128 }
    ],
    labels: [
      { name: 'bug', value: 145 },
      { name: 'feature', value: 98 },
      { name: 'documentation', value: 56 },
      { name: 'enhancement', value: 78 }
    ],
    assignees: [
      { name: 'john.doe', value: 45 },
      { name: 'jane.smith', value: 38 },
      { name: 'bob.wilson', value: 29 }
    ],
    monthlyTrends: [
      { month: 'Jan', created: 25, closed: 22 },
      { month: 'Feb', created: 30, closed: 28 },
      { month: 'Mar', created: 28, closed: 25 }
    ]
  },
  pullRequests: {
    stats: [
      { month: 'Jan', opened: 45, merged: 40, closed: 5 },
      { month: 'Feb', opened: 38, merged: 35, closed: 3 },
      { month: 'Mar', opened: 42, merged: 38, closed: 4 }
    ],
    contributors: [
      { name: 'john.doe', prs: 25, reviews: 30 },
      { name: 'jane.smith', prs: 20, reviews: 35 },
      { name: 'bob.wilson', prs: 15, reviews: 25 }
    ],
    sizes: [
      { size: 'Small (<10 files)', count: 45 },
      { size: 'Medium (10-50 files)', count: 25 },
      { size: 'Large (>50 files)', count: 10 }
    ]
  },
  repositoryHealth: {
    velocity: [
      { month: 'Jan', commits: 156 },
      { month: 'Feb', commits: 142 },
      { month: 'Mar', commits: 168 }
    ],
    responseTimes: [
      { type: 'Issues', time: 24 },
      { type: 'PRs', time: 12 },
      { type: 'Reviews', time: 8 }
    ]
  },
  workflows: {
    success: [
      { name: 'CI', total: 150, success: 145 },
      { name: 'Deploy', total: 50, success: 48 },
      { name: 'Tests', total: 150, success: 147 }
    ],
    runtime: [
      { workflow: 'CI', time: 12 },
      { workflow: 'Deploy', time: 8 },
      { workflow: 'Tests', time: 15 }
    ]
  }
};

export const demoRepos = [
  { name: 'react', url: 'https://github.com/facebook/react' },
  { name: 'vue', url: 'https://github.com/vuejs/vue' },
  { name: 'angular', url: 'https://github.com/angular/angular' }
];