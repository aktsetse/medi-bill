"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAnalysis } from "./context/AnalysisContext";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const router = useRouter();
  const { setAnalysis } = useAnalysis();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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

      // Store in shared context and navigate to results
      setAnalysis(result.data);
      console.log("Server response:", result);
      router.push("/results");

    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12 bg-gray-50">

      {/* Upload Section */}
      <div className="z-10 w-full max-w-2xl p-8 bg-white rounded-lg shadow-md mb-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Medical Record Upload</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Record (PDF, JPG, PNG)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={!file || status === "uploading"}
            className={`w-full px-4 py-2 text-white font-bold rounded-md transition-colors
              ${status === "uploading"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {status === "uploading" ? "Analyzing with AI..." : "Secure Upload & Analyze"}
          </button>
        </form>

        {/* Status Messages */}
        {status === "error" && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            ❌ {message}
          </div>
        )}
      </div>
    </main>
  );
}