interface DateRangeFieldProps {
  fromName?: string;
  toName?: string;
  defaultFrom?: string;
  defaultTo?: string;
  disabled?: boolean;
}

export function DateRangeField({
  fromName = "from",
  toName = "to",
  defaultFrom,
  defaultTo,
  disabled = false,
}: DateRangeFieldProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <label className="form-control">
        <span className="label-text mb-1.5 text-sm font-medium">Du</span>
        <input
          type="date"
          name={fromName}
          defaultValue={defaultFrom}
          className="amo-input min-w-40"
          disabled={disabled}
        />
      </label>
      <label className="form-control">
        <span className="label-text mb-1.5 text-sm font-medium">Au</span>
        <input
          type="date"
          name={toName}
          defaultValue={defaultTo}
          className="amo-input min-w-40"
          disabled={disabled}
        />
      </label>
    </div>
  );
}
