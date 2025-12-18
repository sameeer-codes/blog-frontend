const isQuillEmpty = (value) => {
  if (!value) return true;

  const text = value
    .replace(/<(.|\n)*?>/g, "") // strip HTML
    .replace(/&nbsp;/g, " ")
    .trim();

  return text.length === 0;
};

export default isQuillEmpty;
