"use client";

import { formatCurrency } from "@/lib/formatCurrency";

interface KpiCardProps {
    title: string;
    value: number;
    subtitle?: string;
}

export default function KpiCard({ title, value, subtitle }: KpiCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {title}
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
                {formatCurrency(value)}
            </p>
            {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
        </div>
    );
}
