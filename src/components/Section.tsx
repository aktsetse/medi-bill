interface SectionProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export default function Section({ title, children, className = "" }: SectionProps) {
    return (
        <section className={`card-apple p-8 ${className}`}>
            {title && (
                <h2 className="text-lg font-semibold text-[var(--apple-black)] mb-6 pb-4 border-b border-[var(--apple-border)]">
                    {title}
                </h2>
            )}
            {children}
        </section>
    );
}
