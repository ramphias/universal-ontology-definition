"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Layer Rendering Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-[calc(100vh-9rem)] animate-in fade-in">
            <div className="bg-[#1E0505] border border-red-900 rounded-lg p-8 max-w-lg shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                <h2 className="text-xl font-bold text-red-500 mb-4">Application Error</h2>
                <p className="text-red-300 text-sm mb-6 leading-relaxed bg-black/40 p-4 rounded font-mono break-words text-left">
                    {error.message || "An unexpected rendering error occurred."}
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-4 py-2 bg-red-500/20 text-red-400 text-sm font-semibold rounded hover:bg-red-500/30 transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-transparent border border-red-900 text-red-400 text-sm font-semibold rounded hover:bg-[#333] transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        </div>
    );
}
