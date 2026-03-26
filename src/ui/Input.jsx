export default function Input({
  type,
  validation,
  placeholder,
  id,
  classes,
  ...rest
}) {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      {...validation}
      {...rest}
      className={`w-full border p-2 px-3 rounded-sm border-gray-300 ${classes}`}
    />
  );
}
