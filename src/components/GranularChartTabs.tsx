import React, { useState } from 'react';

interface GranularChartTabsProps {
  dailyContent: React.ReactNode;
  monthlyContent: React.ReactNode;
  tab1Name:string;
   tab2Name:string;
}

export function GranularChartTabs({ dailyContent, monthlyContent, tab1Name, tab2Name }: GranularChartTabsProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('monthly');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex border-b border-gray-200 mb-4">
            <button
                onClick={() => setActiveTab('monthly')}
                className={`px-4 py-2  ${activeTab === 'monthly' ? 'bg-gray-100 border-b-2 border-blue-500 font-semibold text-blue-800' : 'text-gray-600 hover:text-blue-700'}`}
            >
                {tab2Name}
            </button>
             <button
                onClick={() => setActiveTab('daily')}
                className={`px-4 py-2  ${activeTab === 'daily' ? 'bg-gray-100 border-b-2 border-blue-500 font-semibold text-blue-800' : 'text-gray-600 hover:text-blue-700'}`}
            >
               {tab1Name}
            </button>
        </div>
      {activeTab === 'daily' ? dailyContent : monthlyContent}
    </div>
  );
}