"use client";

import { formatLetterAsText } from "@/lib/letterFormatter";

interface AppealLetterProps {
    content: string;
    id?: string;
}

export default function AppealLetter({ content, id = "appeal-letter" }: AppealLetterProps) {
    const formattedContent = formatLetterAsText(content);

    return (
        <div
            id={id}
            className="bg-white border border-[var(--apple-border)] rounded-xl p-10 max-h-[600px] overflow-y-auto"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
            <div className="max-w-2xl mx-auto space-y-5 text-[15px] leading-relaxed text-[var(--apple-black)]">
                {formattedContent.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-justify">
                        {paragraph}
                    </p>
                ))}
            </div>
        </div>
    );
}
