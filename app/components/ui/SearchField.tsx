import clsx from "clsx";
import { Search } from "lucide-react";

interface SearchFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
}

export function SearchField({
  name = "q",
  placeholder = "Rechercher…",
  className,
  ...props
}: SearchFieldProps) {
  return (
    <label
      className={clsx(
        "input input-bordered flex h-11 min-w-0 flex-1 basis-full items-center gap-3 rounded-2xl border-base-300/70 bg-base-100 shadow-sm transition focus-within:border-primary focus-within:outline-2 focus-within:outline-primary/15 sm:basis-64 sm:min-w-[16rem]",
        className,
      )}
    >
      <span className="sr-only">{placeholder}</span>
      <Search
        aria-hidden="true"
        className="size-4 shrink-0 text-base-content/40"
      />
      <input
        {...props}
        type="search"
        name={name}
        placeholder={placeholder}
        className="min-w-0 grow bg-transparent text-sm outline-none placeholder:text-base-content/40"
      />
    </label>
  );
}
