import { Link } from "react-router";

export default function ActionButton({
  children,
  onClick,
  classes,
  className,
  type = "button",
  variant = "primary",
  id,
  disabled = false,
  to,
  as = "button",
  ...rest
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all";

  let styles = "";
  switch (variant) {
    case "secondary":
      styles =
        "border border-slate-300 bg-white text-slate-900 hover:border-slate-900";
      break;
    case "ghost":
      styles =
        "border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-50";
      break;
    case "danger":
      styles = "border border-red-300 bg-white text-red-700 hover:bg-red-50";
      break;
    case "dark":
      styles = "bg-slate-900 text-white hover:bg-slate-700";
      break;
    case "link":
      styles = "px-0 py-0 text-accent-primary hover:text-slate-900";
      break;
    case "primary":
    default:
      styles = "bg-accent-primary text-white hover:bg-accent-secondary";
      break;
  }

  const composedClassName = `${baseStyles} ${styles} ${
    disabled ? "cursor-not-allowed opacity-60" : ""
  } ${classes || className || ""}`;

  if (to) {
    return (
      <Link to={to} className={composedClassName} id={id} {...rest}>
        {children}
      </Link>
    );
  }

  if (as === "label") {
    return (
      <label className={composedClassName} id={id} {...rest}>
        {children}
      </label>
    );
  }

  return (
    <button
      type={type}
      className={composedClassName}
      onClick={onClick}
      id={id}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
