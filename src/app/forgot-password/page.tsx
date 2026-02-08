"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { resetPassword } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--apple-white)] px-6">
            {/* Logo */}
            <div className="mb-12 animate-fade-in">
                <Image
                    src="/medibill_logo.svg"
                    alt="MediBill"
                    width={200}
                    height={67}
                    className="h-12 w-auto"
                    priority
                />
            </div>

            {/* Reset Card */}
            <div className="w-full max-w-[400px] animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <div className="text-center mb-8">
                    <h1 className="text-subheadline mb-2">Reset password</h1>
                    <p className="text-body">We'll send you a link to reset it</p>
                </div>

                {success ? (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 mx-auto rounded-full bg-[var(--apple-green)]/10 flex items-center justify-center">
                            <svg className="w-8 h-8 text-[var(--apple-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-[var(--apple-black)] mb-2">Check your email</h3>
                            <p className="text-body mb-1">
                                We've sent a reset link to
                            </p>
                            <p className="text-[var(--apple-black)] font-medium">{email}</p>
                        </div>
                        <button
                            onClick={() => {
                                setSuccess(false);
                                setEmail("");
                            }}
                            className="text-[var(--apple-blue)] hover:underline text-sm"
                        >
                            Try a different email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 rounded-xl bg-[var(--apple-red)]/5 border border-[var(--apple-red)]/20 text-[var(--apple-red)] text-sm text-center">
                                {error}
                            </div>
                        )}

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-apple"
                            placeholder="Email"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-apple btn-apple-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Sending...
                                </span>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-8 border-t border-[var(--apple-border)] text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-[var(--apple-blue)] hover:underline"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to sign in
                    </Link>
                </div>
            </div>

            <footer className="mt-16 text-center text-caption">
                <p>© 2026 MediBill. All rights reserved.</p>
            </footer>
        </main>
    );
}

function getErrorMessage(error: unknown): string {
    if (error && typeof error === "object" && "code" in error) {
        const code = (error as { code: string }).code;
        switch (code) {
            case "auth/invalid-email":
                return "Please enter a valid email address.";
            case "auth/user-not-found":
                return "No account found with this email.";
            case "auth/too-many-requests":
                return "Too many attempts. Please try again later.";
            default:
                return "Unable to send reset email. Please try again.";
        }
    }
    return "An unexpected error occurred.";
}
