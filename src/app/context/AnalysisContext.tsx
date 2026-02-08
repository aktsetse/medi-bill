"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the data we expect from the backend
export interface AnalysisResult {
  email: string;
  appeal: string;
  potential_money_back: number;
  percentage?: number;
  total_billed_amount: number;
}

interface AnalysisContextType {
  analysis: AnalysisResult | null;
  setAnalysis: (data: AnalysisResult | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  return (
    <AnalysisContext.Provider value={{ analysis, setAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
