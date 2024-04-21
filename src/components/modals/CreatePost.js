import React, { useContext, useState } from "react";
import { FSContext, firestore, storage } from "../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { addDoc, arrayUnion, collection, doc, query, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateUserData } from "../redux/UserSlice";

const CreatePost = (props) => {
  const { post, setPost } = props.data;
  const [image, setImage] = useState(null);
  const { imageUpload, listAllPosts, modifyUserData, isUserPresent } = useContext(FSContext);
  const [caption, setCaption] = useState("");
  const userId = useSelector((store) => store.userInfo.userData.uid);
  const posts = useSelector((store) => store.userInfo.userData.posts);
  const [getPosts, setPosts] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  if (posts != undefined && getPosts == []) {
    console.log("inside if", posts);

    setPosts(posts);
  }
  console.log("createPost", getPosts);
  // const newarray = [];
  // posts.forEach((value) => {
  //   newarray.push(value);
  //   console.log("posts value is", value);
  // });

  async function uploadImage() {
    try {
      if (image == null || caption == "") {
        if (image == null) {
          throw new Error("Please add image");
        } else throw new Error("Please add caption");
      }
      // setErr(null);
      setLoading(true);
      let postObj = {
        id: "",
        caption: caption,
        imgUrl: "",
        likes: [],
        comments: [],
        createdAt: Date.now(),
        createdBy: userId,
      };
      const postRef = collection(firestore, "posts");
      const res = await addDoc(postRef, postObj);
      postObj.id = res?.id;
      const storageRef = ref(storage, `posts/${postObj.id}`);
      const upByte = await uploadBytes(storageRef, image);
      postObj.imgUrl = await getDownloadURL(upByte.ref);

      const docRef = doc(firestore, "posts", postObj?.id);
      await updateDoc(docRef, postObj);

      // const recievedData = await isUserPresent("uid", "==", userId);
      await modifyUserData(
        {
          // posts: [...recievedData.posts, postObj.id],
          posts: arrayUnion(postObj.id),
        },
        userId
      );
      const recievedData2 = await isUserPresent("uid", "==", userId);

      dispatch(updateUserData(recievedData2));
      console.log(posts);
      setLoading(false);
      document.querySelector("#cross-button").click();
    } catch (error) {
      // alert(error.message);
      setErr(error.message);
    }
  }

  return (
    <>
      {post && <div className="fixed top-0 bottom-0 right-0 left-0 opacity-80 bg-black"></div>}
      <div className="min-w-[320px] sm:min-w-96 z-20 space-y-4 p-3 bg-black fixed  top-[20%] left-[50%] -translate-x-[50%] border  rounded-lg shadow   border-gray-700">
        <div className="flex justify-between">
          <div>Create Post</div>
          <div>
            <button id="cross-button" onClick={() => setPost(false)}>
              <svg
                className="h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z" />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <div>
            <textarea
              className="text-black w-full mb-2 min-h-32 p-1"
              placeholder="Caption ..."
              onChange={(e) => setCaption(e.target.value)}
            ></textarea>
          </div>
          <div>
            <input
              type="file"
              name="Upload image"
              id="upload-image"
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
              onClick={(e) => setImage(e.target.files[0])}
            />
            {/* <button onClick={() => document.querySelector("#upload-image").click()}></button>  */}
            <button
              onClick={() => document.querySelector("#upload-image").click()}
              className="relative inline-flex items-center justify-center p-0.5  me-2  overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-green-800"
            >
              <span className="relative px-2 py-1  sm:px-5 sm:py-2.5 transition-all ease-in duration-75  bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Upload Image
              </span>
            </button>
            {err != null && <div className="text-red-500 text-center mt-3">{err}</div>}
          </div>
        </div>
        <div className="flex justify-end ">
          {" "}
          {/* <button onClick={async () => {}}>Post</button> */}
          {loading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={uploadImage}
              className=" border focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-2 sm:px-5 py-1 text-center me-2  border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
            >
              Post
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CreatePost;
