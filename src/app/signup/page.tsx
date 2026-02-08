"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { signUp, user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user) {
            router.push("/");
        }
    }, [user, authLoading, router]);

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter.";
        if (!/[a-z]/.test(password)) return "Include at least one lowercase letter.";
        if (!/[0-9]/.test(password)) return "Include at least one number.";
        return null;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password);
            router.push("/");
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (pwd: string) => {
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[a-z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^A-Za-z0-9]/.test(pwd)) strength++;

        if (strength <= 2) return { width: "33%", color: "bg-[var(--apple-red)]", label: "Weak" };
        if (strength <= 3) return { width: "66%", color: "bg-yellow-500", label: "Fair" };
        return { width: "100%", color: "bg-[var(--apple-green)]", label: "Strong" };
    };

    const strength = getPasswordStrength(password);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--apple-white)]">
                <div className="w-8 h-8 border-2 border-[var(--apple-border)] border-t-[var(--apple-blue)] rounded-full animate-spin" />
            </div>
        );
    }

    if (user) return null;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--apple-white)] px-6 py-12">
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

            {/* Signup Card */}
            <div className="w-full max-w-[400px] animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <div className="text-center mb-8">
                    <h1 className="text-subheadline mb-2">Create your account</h1>
                    <p className="text-body">Join MediBill today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-4 rounded-xl bg-[var(--apple-red)]/5 border border-[var(--apple-red)]/20 text-[var(--apple-red)] text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-apple"
                            placeholder="Email"
                        />

                        <div className="space-y-2">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-apple"
                                placeholder="Password"
                            />
                            {password && (
                                <div className="space-y-1">
                                    <div className="h-1 bg-[var(--apple-light-gray)] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${strength.color} transition-all duration-300`}
                                            style={{ width: strength.width }}
                                        />
                                    </div>
                                    <p className="text-xs text-[var(--apple-gray)]">{strength.label}</p>
                                </div>
                            )}
                        </div>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="input-apple"
                            placeholder="Confirm password"
                        />
                    </div>

                    {/* Requirements */}
                    <div className="text-xs text-[var(--apple-gray)] space-y-1">
                        <p className={password.length >= 8 ? "text-[var(--apple-green)]" : ""}>• At least 8 characters</p>
                        <p className={/[A-Z]/.test(password) ? "text-[var(--apple-green)]" : ""}>• One uppercase letter</p>
                        <p className={/[a-z]/.test(password) ? "text-[var(--apple-green)]" : ""}>• One lowercase letter</p>
                        <p className={/[0-9]/.test(password) ? "text-[var(--apple-green)]" : ""}>• One number</p>
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
                                Creating account...
                            </span>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-[var(--apple-border)] text-center">
                    <p className="text-body">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[var(--apple-blue)] hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
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
            case "auth/email-already-in-use":
                return "An account with this email already exists.";
            case "auth/invalid-email":
                return "Please enter a valid email address.";
            case "auth/weak-password":
                return "Please choose a stronger password.";
            default:
                return "Unable to create account. Please try again.";
        }
    }
    return "An unexpected error occurred.";
}
