import { useParams } from "react-router";

export default function SinglePost() {
  const params = useParams();
  console.log(params);
  return (
    <>
      {/* <Header {...{ pageTitle: "Sameer's Code Lab" }} /> */}
      <p>This is the Post Content</p>
      {/* <Footer /> */}
    </>
  );
}
