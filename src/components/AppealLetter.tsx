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
            className="bg-white border border-gray-200 rounded p-8 max-h-[500px] overflow-y-auto"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
            <div className="max-w-2xl mx-auto space-y-6 text-sm leading-relaxed text-gray-800">
                {formattedContent.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-justify">
                        {paragraph}
                    </p>
                ))}
            </div>
        </div>
    );
}
