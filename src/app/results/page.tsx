"use client";

import { useAnalysis } from "../context/AnalysisContext";
import Link from "next/link";
import Image from "next/image";
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
            <main className="min-h-screen bg-[var(--apple-white)] flex items-center justify-center px-6">
                <div className="text-center space-y-6 animate-fade-in">
                    <div className="w-20 h-20 mx-auto rounded-full bg-[var(--apple-light-gray)] flex items-center justify-center">
                        <svg className="w-10 h-10 text-[var(--apple-gray)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-subheadline mb-2">No Results Yet</h1>
                        <p className="text-body max-w-sm mx-auto">
                            Upload a medical bill to see your analysis results here.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="btn-apple btn-apple-primary inline-flex"
                    >
                        Upload a Bill
                    </Link>
                </div>
            </main>
        );
    }

    const totalBilled = analysis.total_billed_amount;
    const potentialSavings = analysis.potential_money_back;
    const savingsPercentage = totalBilled > 0
        ? ((potentialSavings / totalBilled) * 100).toFixed(0)
        : "0";
    const reportDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="min-h-screen bg-[var(--apple-bg)]">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--apple-white)]/80 backdrop-blur-xl border-b border-[var(--apple-border)]/50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/">
                        <Image
                            src="/medibill_logo.svg"
                            alt="MediBill"
                            width={120}
                            height={40}
                            className="h-8 w-auto"
                            priority
                        />
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-[var(--apple-blue)] hover:underline transition-colors"
                    >
                        New Analysis
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="mb-12 animate-fade-in">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-[var(--apple-blue)] hover:underline mb-6"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </Link>
                        <h1 className="text-headline">Analysis Report</h1>
                        <p className="text-body mt-2">{reportDate}</p>
                    </header>

                    <div className="flex flex-col xl:flex-row gap-8">
                        {/* Main Content */}
                        <div className="flex-1 space-y-8 animate-fade-in-up">
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-foreground ">
                                <KpiCard title="Total Billed" value={totalBilled} />
                                <KpiCard
                                    title="Potential Savings"
                                    value={potentialSavings}
                                    subtitle={`${savingsPercentage}% of total`}
                                />
                                {/* Win Probability Card */}
                                <div className="card-apple p-6">
                                    <p className="text-sm font-medium mb-2 text-[var(--apple-gray)]">
                                        Win Probability
                                    </p>
                                    <p className="text-4xl font-bold text-[var(--apple-blue)]">
                                        {Math.min(analysis.percentage ?? 0, 100)}%
                                    </p>
                                </div>
                            </div>

                            {/* Chart Section */}
                            <Section title="Savings Overview">
                                <SpendComparisonChart
                                    totalBilled={totalBilled}
                                    potentialSavings={potentialSavings}
                                />
                            </Section>

                            {/* Recommendations */}
                            <Section title="Recommendations">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-[var(--apple-black)]">
                                        Appeal Strategy
                                    </h4>
                                    <ul className="space-y-3">
                                        {[
                                            "Review itemized charges for duplicate or erroneous entries",
                                            "Compare charges against standard rates for your region",
                                            "Contact your insurance provider to verify coverage",
                                            "Submit formal appeal using the generated letter below"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-body">
                                                <span className="w-5 h-5 rounded-full bg-[var(--apple-blue)]/10 text-[var(--apple-blue)] flex items-center justify-center flex-shrink-0 text-xs font-medium">
                                                    {i + 1}
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                </div>
                            </Section>

                            {/* Appeal Letter */}
                            <Section title="Appeal Letter">
                                <div className="flex justify-end mb-4">
                                    <button
                                        onClick={() => navigator.clipboard.writeText(analysis.appeal)}
                                        className="text-sm text-[var(--apple-blue)] hover:underline flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy
                                    </button>
                                </div>
                                <AppealLetter content={analysis.appeal} id="appeal-letter-content" />
                            </Section>

                            {/* Notes */}
                            <div className="text-caption space-y-2 pt-4">
                                <p className="font-medium text-[var(--apple-gray)]">Assumptions & Notes</p>
                                <ul className="space-y-1 text-[var(--apple-gray)]/70">
                                    <li>• Analysis based on uploaded document data only</li>
                                    <li>• Savings estimates are approximate and subject to negotiation</li>
                                    <li>• Consult with a billing specialist for complex cases</li>
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="xl:w-72 order-first xl:order-last animate-fade-in" style={{ animationDelay: "0.2s" }}>
                            <div className="xl:sticky xl:top-24">
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

            {/* Footer */}
            <footer className="py-8 text-center text-caption border-t border-[var(--apple-border)]">
                <p>© 2026 MediBill. All rights reserved.</p>
            </footer>
        </div>
    );
}
