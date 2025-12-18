export default function ImageUpload() {
  let handlefilechange = (e) => {
    console.log(e.target.files);
  };
  return (
    <>
      <input
        type="file"
        accept="image/jpeg, image/png, image/webp"
        onChange={handlefilechange}
      />
    </>
  );
}
