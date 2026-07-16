import clsx from "clsx";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  name: string;
  label: string;
  value?: string;
  allLabel: string;
  options: FilterOption[];
  className?: string;
}

export function FilterSelect({
  name,
  label,
  value,
  allLabel,
  options,
  className,
}: FilterSelectProps) {
  return (
    <label className={clsx("form-control w-full md:w-auto", className)}>
      <span className="sr-only">{label}</span>
      <select
        name={name}
        defaultValue={value ?? ""}
        className="select select-bordered h-11 w-full rounded-2xl border-base-300/70 bg-base-100 md:min-w-44"
        aria-label={label}
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
