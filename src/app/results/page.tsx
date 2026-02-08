"use client";

import { useAnalysis } from "../context/AnalysisContext";
import Link from "next/link";

export default function ResultsPage() {
    const { analysis } = useAnalysis();

    const handleSendEmail = async () => {
        if (!analysis?.email) return;

        console.log("Sending email with content:", analysis.email);

        // TODO: Implement the actual email sending logic here
        alert("Email sending logic triggered! (Check console for content)");
    };

    // Empty state when no data exists
    if (!analysis) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-gray-50">
                <div className="text-center space-y-6">
                    <div className="text-6xl">📋</div>
                    <h1 className="text-2xl font-bold text-gray-800">No Results Yet</h1>
                    <p className="text-gray-600 max-w-md">
                        Upload and analyze a medical record to see your results here.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors"
                    >
                        ← Go Back to Upload
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-12 bg-gray-50">
            {/* Back Navigation */}
            <div className="w-full max-w-2xl mb-6">
                <Link
                    href="/"
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                >
                    ← Upload Another Record
                </Link>
            </div>

            {/* Results Section */}
            <div className="w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Success Header */}
                <div className="p-4 bg-green-100 text-green-700 rounded-md text-center">
                    ✅ Analysis Complete!
                </div>

                {/* Recovery Stats Card */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-green-800 uppercase tracking-wider">Potential Recovery</h3>
                        <p className="mt-2 text-3xl font-extrabold text-green-600">{analysis.potential_money_back}</p>
                    </div>
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-blue-800 uppercase tracking-wider">Win Probability</h3>
                        <p className="mt-2 text-3xl font-extrabold text-blue-600">
                            {Number(analysis.percentage) || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Appeal Letter Display */}
                <div className="p-8 bg-white rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Appeal Letter</h2>
                        <button
                            onClick={() => navigator.clipboard.writeText(analysis.appeal)}
                            className="text-sm text-gray-500 hover:text-blue-600 underline"
                        >
                            Copy Text
                        </button>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md border border-gray-200 h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap text-gray-700">
                        {analysis.appeal}
                    </div>
                </div>

                {/* Email Action Area */}
                <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-100 flex flex-col items-center text-center">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-2">Ready to submit?</h3>
                    <p className="text-indigo-700 mb-4 text-sm max-w-md">
                        We have drafted an email to your provider based on this appeal. Click below to review and send.
                    </p>
                    <button
                        onClick={handleSendEmail}
                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <span>📧</span> Prepare Draft Email
                    </button>
                </div>

            </div>
        </main>
    );
}
