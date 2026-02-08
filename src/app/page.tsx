"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAnalysis } from "./context/AnalysisContext";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}

function HomeContent() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);

  const router = useRouter();
  const { setAnalysis } = useAnalysis();
  const { user, signOut } = useAuth();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setAnalysis(result.data);
      router.push("/results");

    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--apple-white)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--apple-white)]/80 backdrop-blur-xl border-b border-[var(--apple-border)]/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Image
            src="/medibill_logo.svg"
            alt="MediBill"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />
          <div className="flex items-center gap-6">
            <span className="text-sm text-[var(--apple-gray)]">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-[var(--apple-blue)] hover:underline transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
          {/* Hero */}
          <h1 className="text-headline mb-6">
            Analyze your<br />medical bills.
          </h1>
          <p className="text-body text-xl max-w-lg mx-auto mb-16">
            Upload your medical bill and let our AI identify potential savings
            and generate appeal letters instantly.
          </p>

          {/* Upload Card */}
          <form onSubmit={handleSubmit} className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                card-apple p-12 transition-all duration-300 cursor-pointer
                ${dragActive ? "border-[var(--apple-blue)] bg-[var(--apple-blue)]/5" : ""}
                ${file ? "border-[var(--apple-green)]" : ""}
              `}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
              />

              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="flex flex-col items-center">
                  {file ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-[var(--apple-green)]/10 flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-[var(--apple-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-[var(--apple-black)] mb-2">{file.name}</p>
                      <p className="text-sm text-[var(--apple-gray)]">Click to choose a different file</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-[var(--apple-light-gray)] flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-[var(--apple-gray)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-[var(--apple-black)] mb-2">
                        Drop your medical bill here
                      </p>
                      <p className="text-sm text-[var(--apple-gray)]">or click to browse</p>
                      <p className="text-xs text-[var(--apple-gray)] mt-4">Supports PDF, PNG, JPG</p>
                    </>
                  )}
                </div>
              </label>
            </div>

            {status === "error" && (
              <div className="mt-4 p-4 rounded-xl bg-[var(--apple-red)]/5 border border-[var(--apple-red)]/20 text-[var(--apple-red)] text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || status === "uploading"}
              className="btn-apple btn-apple-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {status === "uploading" ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Analyze Bill"
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-caption border-t border-[var(--apple-border)]">
        <p>© 2026 MediBill. All rights reserved.</p>
      </footer>
    </div>
  );
}