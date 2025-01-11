import React from 'react';
import { ArrowRight } from 'lucide-react';
import { mockDashboardData } from '../data/mockData';
import { IssueAnalytics } from './visualizations/IssueAnalytics';

interface DemoSectionProps {
  onSelectRepo: (url: string) => void;
}

export function DemoSection({ onSelectRepo }: DemoSectionProps) {
  const demoRepos = [
    { name: 'React', url: 'facebook/react' },
    { name: 'Vue', url: 'vuejs/vue' },
    { name: 'Angular', url: 'angular/angular' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-4">Try with these popular repositories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demoRepos.map((repo) => (
            <button
              key={repo.name}
              onClick={() => onSelectRepo(`https://github.com/${repo.url}`)}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <span>{repo.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-center">Sample Visualization</h3>
        <IssueAnalytics data={mockDashboardData.issues} />
      </div>
    </div>
  );
}