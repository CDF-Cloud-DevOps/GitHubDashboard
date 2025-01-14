// src/components/Dashboard.tsx
import React from 'react';
import { DateRangeSelector } from './DateRangeSelector';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useGitHubData } from '../hooks/useGitHubData';
import { GithubConfig } from '../types/github';
import { DashboardContent } from './DashboardContent';
import { ArrowLeft } from 'lucide-react';
import { ConfigForm } from './ConfigForm'; // Import ConfigForm

interface DashboardProps {
    config: GithubConfig;
    onBack: () => void;
    dashboardConfig: any;
    onConfigChange: (newConfig: any) => void;
}

export function Dashboard({ config, onBack, dashboardConfig, onConfigChange }: DashboardProps) {
    const [dateRange, setDateRange] = React.useState('1m');
    const { data, loading, error, loadingMessage } = useGitHubData(config, dateRange);

    const handleRetry = () => {
        // Re-fetch data by resetting the date range, which triggers the useEffect in useGitHubData
        setDateRange(dateRange);
    };

    if (loading) {
        return <LoadingSpinner message={loadingMessage} />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={handleRetry} />;
    }

    if (!data) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Repository Selection
                </button>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Repository Analytics Dashboard</h1>
                        <p className="text-gray-600">
                            Analyzing: <span className="font-medium">{config.repoUrl}</span>
                        </p>
                    </div>
                    <DateRangeSelector
                        value={dateRange}
                        onChange={setDateRange}
                        data={data}
                    />
                </div>
            </header>

            <DashboardContent data={data} dateRange={dateRange} dashboardConfig={dashboardConfig} />
        </div>
    );
}