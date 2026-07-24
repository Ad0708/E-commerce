interface FormHeaderProps {
  title: string;
  description: string;
}

export default function FormHeader({
  title,
  description,
}: FormHeaderProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h1>

      <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}