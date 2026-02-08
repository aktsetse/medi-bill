"use client";

import { formatCurrency } from "@/lib/formatCurrency";

interface KpiCardProps {
    title: string;
    value: number;
    subtitle?: string;
    highlight?: boolean;
}

export default function KpiCard({ title, value, subtitle, highlight }: KpiCardProps) {
    return (
        <div className={`
            card-apple p-6 transition-all duration-300
            ${highlight ? "bg-[var(--apple-black)] text-white" : ""}
        `}>
            <p className={`text-sm font-medium mb-2 ${highlight ? "text-white/70" : "text-[var(--apple-gray)]"}`}>
                {title}
            </p>
            <p className={`text-3xl font-semibold tracking-tight ${highlight ? "text-white" : "text-[var(--apple-black)]"}`}>
                {formatCurrency(value)}
            </p>
            {subtitle && (
                <p className={`mt-2 text-sm ${highlight ? "text-white/60" : "text-[var(--apple-gray)]"}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}
