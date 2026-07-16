import clsx from "clsx";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}

export function FormField({
  label,
  htmlFor,
  children,
  className,
  hint,
}: FormFieldProps) {
  return (
    <label className={clsx("flex flex-col gap-1.5", className)} htmlFor={htmlFor}>
      <span className="text-sm font-medium text-secondary">{label}</span>
      {children}
      {hint ? (
        <span className="text-xs text-base-content/50">{hint}</span>
      ) : null}
    </label>
  );
}
