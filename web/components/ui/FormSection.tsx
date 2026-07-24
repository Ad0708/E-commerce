interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormSection({
  title,
  description,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}
