interface SectionProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export default function Section({ title, children, className = "" }: SectionProps) {
    return (
        <section className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
            {title && (
                <h2 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                    {title}
                </h2>
            )}
            {children}
        </section>
    );
}
