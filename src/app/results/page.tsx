"use client";

import { useAnalysis } from "../context/AnalysisContext";
import Link from "next/link";
import KpiCard from "@/components/KpiCard";
import SpendComparisonChart from "@/components/SpendComparisonChart";
import Section from "@/components/Section";
import ActionPanel from "@/components/ActionPanel";
import AppealLetter from "@/components/AppealLetter";
import { formatCurrency } from "@/lib/formatCurrency";

export default function ResultsPage() {
    const { analysis } = useAnalysis();

    // Empty state
    if (!analysis) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <div className="text-5xl text-gray-300">📋</div>
                    <h1 className="text-xl font-semibold text-gray-800">No Results Yet</h1>
                    <p className="text-gray-500 max-w-sm">
                        Upload and analyze a medical record to see your results here.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                    >
                        ← Go Back to Upload
                    </Link>
                </div>
            </main>
        );
    }

    // Derived metrics
    const totalBilled = analysis.total_billed_amount;
    const potentialSavings = analysis.potential_money_back;
    const savingsPercentage = totalBilled > 0
        ? ((potentialSavings / totalBilled) * 100).toFixed(1)
        : "0";
    const reportDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
                >
                    ← Back to Upload
                </Link>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Header */}
                        <header className="bg-white border border-gray-200 rounded-lg p-6">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Medical Bill Analysis Report
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Billing Review & Appeal Recommendations
                            </p>
                            <p className="text-xs text-gray-400 mt-2">{reportDate}</p>
                        </header>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <KpiCard title="Total Billed" value={totalBilled} />
                            <KpiCard
                                title="Potential Savings"
                                value={potentialSavings}
                                subtitle={`${savingsPercentage}% of total`}
                            />
                            <KpiCard
                                title="Estimated Net Cost"
                                value={totalBilled - potentialSavings}
                            />
                        </div>

                        {/* Chart Section */}
                        <Section title="Potential Money Saved">
                            <SpendComparisonChart
                                totalBilled={totalBilled}
                                potentialSavings={potentialSavings}
                            />
                        </Section>

                        {/* Recommendations */}
                        <Section title="Recommendations">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Appeal Strategy
                                    </h4>
                                    <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
                                        <li>Review itemized charges for duplicate or erroneous entries</li>
                                        <li>Compare charges against standard rates for your region</li>
                                        <li>Contact your insurance provider to verify coverage details</li>
                                        <li>Submit formal appeal using the generated letter below</li>
                                    </ul>
                                </div>
                                {analysis.percentage !== undefined && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium text-gray-700">Win Probability: </span>
                                            {(analysis.percentage * 100).toFixed(0)}%
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Section>

                        {/* Appeal Letter */}
                        <Section title="Generated Appeal Letter">
                            <div className="flex justify-end mb-3">
                                <button
                                    onClick={() => navigator.clipboard.writeText(analysis.appeal)}
                                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                                >
                                    Copy to clipboard
                                </button>
                            </div>
                            <AppealLetter content={analysis.appeal} id="appeal-letter-content" />
                        </Section>

                        {/* Assumptions & Notes */}
                        <section className="text-xs text-gray-400 space-y-1 px-1">
                            <p className="font-medium text-gray-500">Assumptions & Notes</p>
                            <ul className="list-disc list-inside space-y-0.5">
                                <li>Analysis based on uploaded document data only</li>
                                <li>Savings estimates are approximate and subject to negotiation</li>
                                <li>Win probability is an algorithmic estimate, not a guarantee</li>
                                <li>Consult with a healthcare billing specialist for complex cases</li>
                            </ul>
                        </section>
                    </div>

                    {/* Action Panel - Sidebar on desktop, top on mobile */}
                    <aside className="lg:w-64 order-first lg:order-last">
                        <div className="lg:sticky lg:top-8">
                            <ActionPanel
                                letterElementId="appeal-letter-content"
                                emailContent={analysis.appeal}
                                emailSubject={`Medical Bill Appeal - ${formatCurrency(potentialSavings)} Potential Recovery`}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
