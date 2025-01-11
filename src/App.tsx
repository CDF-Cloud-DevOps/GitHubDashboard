import React, { useState } from 'react';
import { ConfigForm } from './components/ConfigForm';
import { Dashboard } from './components/Dashboard';
import { DemoSection } from './components/DemoSection';
import { GithubConfig } from './types/github';

export default function App() {
  const [config, setConfig] = useState<GithubConfig | null>(null);

  const handleConfigSubmit = (newConfig: GithubConfig) => {
    setConfig(newConfig);
  };

  const handleDemoSelect = (repoUrl: string) => {
    setConfig({
      repoUrl,
      isPrivate: false
    });
  };

  const handleBack = () => {
    setConfig(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!config ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
          <ConfigForm onSubmit={handleConfigSubmit} />
          <DemoSection onSelectRepo={handleDemoSelect} />
        </div>
      ) : (
        <Dashboard config={config} onBack={handleBack} />
      )}
    </div>
  );
}