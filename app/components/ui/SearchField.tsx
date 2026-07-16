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
        "relative block min-w-0 flex-1 basis-full sm:basis-64 sm:min-w-[16rem]",
        className,
      )}
    >
      <span className="sr-only">{placeholder}</span>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-base-content/40"
      />
      <input
        {...props}
        type="search"
        name={name}
        placeholder={placeholder}
        className="amo-input h-11 pl-10"
      />
    </label>
  );
}
