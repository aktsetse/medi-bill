"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
} from "recharts";
import { formatCurrency, formatCurrencyCompact } from "@/lib/formatCurrency";

interface SpendComparisonChartProps {
    totalBilled: number;
    potentialSavings: number;
}

export default function SpendComparisonChart({
    totalBilled,
    potentialSavings,
}: SpendComparisonChartProps) {
    const savingsPercentage = totalBilled > 0
        ? ((potentialSavings / totalBilled) * 100).toFixed(0)
        : "0";

    const data = [
        {
            name: "Total Billed",
            amount: totalBilled,
            fill: "#86868b", // Apple gray
        },
        {
            name: `Potential Savings (${savingsPercentage}%)`,
            amount: potentialSavings,
            fill: "#34c759", // Apple green
        },
    ];

    return (
        <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 20, right: 100, left: 20, bottom: 20 }}
                    barSize={40}
                >
                    <XAxis
                        type="number"
                        tickFormatter={formatCurrencyCompact}
                        tick={{ fill: "#86868b", fontSize: 12 }}
                        axisLine={{ stroke: "#d2d2d7" }}
                        tickLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: "#1d1d1f", fontSize: 14, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        width={180}
                    />
                    <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #d2d2d7",
                            borderRadius: "12px",
                            fontSize: "14px",
                            padding: "12px 16px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                        }}
                    />
                    <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                        <LabelList
                            dataKey="amount"
                            position="right"
                            formatter={(value: unknown) => value != null ? formatCurrency(Number(value)) : ""}
                            style={{ fill: "#1d1d1f", fontSize: 14, fontWeight: 600 }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
