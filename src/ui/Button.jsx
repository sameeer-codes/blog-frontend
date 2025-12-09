export default function Button({
  children,
  onClick,
  className,
  type,
  variant,
}) {
  let styles = "";
  switch (variant) {
    case "primary":
      styles =
        "p-2 bg-blue-700 rounded-sm text-white cursor-pointer hover:bg-blue-900 transition-all font-medium  border-2 border-solid border-blue-700 hover:border-blue-900";
      break;
    case "secondary":
      styles =
        "p-2 bg-white rounded-sm text-blue-700 cursor-pointer hover:bg-blue-900 transition-all font-medium  hover:text-white border-2 border-solid border-blue-700 hover:border-blue-900";
      break;
    case "link":
      styles =
        "text-blue-700 hover:text-blue-900 transition-all cursor-pointer";
      break;
    default:
      styles =
        "p-2 bg-blue-700 rounded-md text-white cursor-pointer hover:bg-blue-900 transition-all font-medium border-2 border-solid border-blue-700 hover:border-blue-900";
      break;
  }
  return (
    <button
      type={type}
      className={`${styles} ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
