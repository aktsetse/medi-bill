"use client";

import { useState } from "react";
import jsPDF from "jspdf";

interface ActionPanelProps {
    letterElementId: string;
    emailContent: string;
    emailSubject?: string;
}

export default function ActionPanel({
    letterElementId,
    emailContent,
    emailSubject = "Medical Bill Appeal",
}: ActionPanelProps) {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handleDownloadPdf = async () => {
        const element = document.getElementById(letterElementId);
        if (!element) {
            alert("Could not find letter content to export");
            return;
        }

        setIsGeneratingPdf(true);

        try {
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "in",
                format: "letter",
            });

            // Page dimensions
            const pageWidth = 8.5;
            const pageHeight = 11;
            const marginLeft = 1;
            const marginRight = 1;
            const marginTop = 1;
            const marginBottom = 1;
            const usableWidth = pageWidth - marginLeft - marginRight;

            // Font settings
            const fontSize = 12;
            const lineHeight = fontSize * 1.5 / 72; // Convert points to inches

            pdf.setFont("times", "normal");
            pdf.setFontSize(fontSize);

            // Extract text content from the element
            const textContent = element.innerText || element.textContent || "";

            // Split text into lines that fit within the usable width
            const lines = pdf.splitTextToSize(textContent, usableWidth);

            let currentY = marginTop;
            let pageNumber = 1;

            for (let i = 0; i < lines.length; i++) {
                // Check if we need a new page
                if (currentY + lineHeight > pageHeight - marginBottom) {
                    pdf.addPage();
                    pageNumber++;
                    currentY = marginTop;
                }

                pdf.text(lines[i], marginLeft, currentY);
                currentY += lineHeight;
            }

            pdf.save("medical-bill-appeal.pdf");
        } catch (error) {
            console.error("PDF generation error:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const handleSendEmail = () => {
        // Create mailto link with pre-filled content
        const subject = encodeURIComponent(emailSubject);
        const body = encodeURIComponent(emailContent);
        const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

        // Open default email client
        window.location.href = mailtoLink;
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Actions
            </h3>
            <div className="flex flex-col gap-3">
                <button
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGeneratingPdf ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download PDF
                        </>
                    )}
                </button>
                <button
                    onClick={handleSendEmail}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 border border-gray-900 rounded-md text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send via Email
                </button>
            </div>
            <p className="mt-3 text-xs text-gray-400 text-center">
                Opens your default email client
            </p>
        </div>
    );
}
