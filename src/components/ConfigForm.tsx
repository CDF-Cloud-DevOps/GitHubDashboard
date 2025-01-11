import React, { useState } from 'react';
import { GithubConfig } from '../types/github';
import { AlertCircle } from 'lucide-react';

interface ConfigFormProps {
  onSubmit: (config: GithubConfig) => void;
    initialPat?: string;
}

export function ConfigForm({ onSubmit, initialPat }: ConfigFormProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
    const [pat, setPat] = useState(initialPat || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      repoUrl,
      isPrivate,
      pat: isPrivate ? pat : undefined
    });
  };

  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Repository Configuration</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Repository URL
          </label>
          <input
            id="repoUrl"
            type="url"
            required
            placeholder="https://github.com/owner/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            id="isPrivate"
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
            This is a private repository
          </label>
        </div>

        {isPrivate && (
          <div>
            <label htmlFor="pat" className="block text-sm font-medium text-gray-700 mb-1">
              Personal Access Token (PAT)
            </label>
            <input
              id="pat"
              type="password"
              required
              placeholder="ghp_..."
              value={pat}
              onChange={(e) => setPat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Load Repository Analytics
        </button>
      </form>
    </div>
  );
}