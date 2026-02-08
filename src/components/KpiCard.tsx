"use client";

import { formatCurrency } from "@/lib/formatCurrency";

interface KpiCardProps {
    title: string;
    value: number;
    subtitle?: string;
    highlight?: boolean;
    isCurrency?: boolean;
    suffix?: string;
}

export default function KpiCard({
    title,
    value,
    subtitle,
    highlight,
    isCurrency = true,
    suffix = ""
}: KpiCardProps) {
    const displayValue = isCurrency ? formatCurrency(value) : `${value}${suffix}`;

    return (
        <div className={`
            card-apple p-6 transition-all duration-300
            ${highlight ? "bg-[var(--apple-black)] text-white" : ""}
        `}>
            <p className={`text-sm font-medium mb-2 ${highlight ? "text-white/70" : "text-[var(--apple-gray)]"}`}>
                {title}
            </p>
            <p className={`text-3xl font-semibold tracking-tight ${highlight ? "text-white" : "text-[var(--apple-black)]"}`}>
                {displayValue}
            </p>
            {subtitle && (
                <p className={`mt-2 text-sm ${highlight ? "text-white/60" : "text-[var(--apple-gray)]"}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}
