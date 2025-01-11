import React from 'react';
import { Calendar, Download } from 'lucide-react';
import { exportToExcel } from '../utils/export';

interface DateRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  data: any;
}

export function DateRangeSelector({ value, onChange, data }: DateRangeSelectorProps) {
  const handleExport = () => {
    try {
      exportToExcel(data, 'github-analytics-export');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm">
        <Calendar className="w-4 h-4 text-gray-500" />
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-none bg-transparent focus:outline-none text-gray-700"
        >
          <option value="1m">Last Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last Year</option>
          <option value="3y">Last 3 Years</option>
        </select>
      </div>
      <button 
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <Download className="w-4 h-4" />
        Export Data
      </button>
    </div>
  );
}