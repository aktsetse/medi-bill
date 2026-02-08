"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
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
        ? ((potentialSavings / totalBilled) * 100).toFixed(1)
        : "0";

    const data = [
        {
            name: "Total Billed",
            amount: totalBilled,
            fill: "#6b7280",
        },
        {
            name: `Potential Savings (${savingsPercentage}%)`,
            amount: potentialSavings,
            fill: "#16a34a",
        },
    ];

    return (
        <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 10, right: 80, left: 10, bottom: 10 }}
                    barSize={32}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis
                        type="number"
                        tickFormatter={formatCurrencyCompact}
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        tickLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: "#374151", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        width={160}
                    />
                    <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "4px",
                            fontSize: "12px",
                        }}
                    />
                    <Bar dataKey="amount" radius={[0, 2, 2, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                        <LabelList
                            dataKey="amount"
                            position="right"
                            formatter={(value: unknown) => value != null ? formatCurrency(Number(value)) : ""}
                            style={{ fill: "#374151", fontSize: 12, fontWeight: 500 }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
