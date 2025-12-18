export default function Input({ type, validation, placeholder, id, classes }) {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      {...validation}
      className={`w-full border p-2 px-3 rounded-sm border-gray-300 ${classes}`}
    />
  );
}
