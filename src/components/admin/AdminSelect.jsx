export function humanizeAdminValue(value) {
  if (!value) {
    return "Unknown";
  }

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function AdminSelect({
  value,
  onChange,
  options,
  ariaLabel,
  classes = "",
  disabled = false,
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100 ${classes}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
