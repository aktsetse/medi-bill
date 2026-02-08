"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { signIn, user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user) {
            router.push("/");
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signIn(email, password);
            router.push("/");
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--apple-white)]">
                <div className="w-8 h-8 border-2 border-[var(--apple-border)] border-t-[var(--apple-blue)] rounded-full animate-spin" />
            </div>
        );
    }

    if (user) {
        return null;
    }

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

            {/* Login Card */}
            <div className="w-full max-w-[400px] animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <div className="text-center mb-8">
                    <h1 className="text-subheadline mb-2">Sign in</h1>
                    <p className="text-body">Access your MediBill account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-4 rounded-xl bg-[var(--apple-red)]/5 border border-[var(--apple-red)]/20 text-[var(--apple-red)] text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-apple"
                                placeholder="Email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-apple"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="text-right">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-[var(--apple-blue)] hover:underline transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

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
                                Signing in...
                            </span>
                        ) : (
                            "Continue"
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-[var(--apple-border)] text-center">
                    <p className="text-body">
                        New to MediBill?{" "}
                        <Link href="/signup" className="text-[var(--apple-blue)] hover:underline font-medium">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Footer */}
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
            case "auth/user-disabled":
                return "This account has been disabled.";
            case "auth/user-not-found":
            case "auth/wrong-password":
            case "auth/invalid-credential":
                return "Invalid email or password.";
            case "auth/too-many-requests":
                return "Too many attempts. Please try again later.";
            default:
                return "Unable to sign in. Please try again.";
        }
    }
    return "An unexpected error occurred.";
}
