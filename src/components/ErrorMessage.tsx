// src/components/ErrorMessage.tsx
import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <div className="flex items-center gap-2 text-red-800 mb-4">
                    <AlertCircle className="w-5 h-5" />
                    <h3 className="font-semibold">Error Loading Data</h3>
                </div>
                <p className="text-red-600 mb-4">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
}