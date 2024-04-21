import React, { useContext, useState, useEffect } from "react";
import ProfilePost from "./ProfilePost";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { FSContext, firestore, storage } from "../firebase/firebase";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { updateUserPosts } from "./redux/UserSlice";
import ProfileShimmer from "./ProfileShimmer";
import CommentContainer from "./modals/CommentContainer";
import useAddComment from "./hooks/useAddComment";

const ProfilePostContainer = (props) => {
  // const [posts, setPosts] = useState(null);

  const { userId } = useParams();
  // const dispatch = useDispatch();
  const posts = useSelector((store) => store.userInfo.userData.posts);
  const loggedInUser = useSelector((store) => store.userInfo.userData);
  const { isUserPresent, modifyUserData } = useContext(FSContext);
  const [test, setTest] = useState([]);
  const [openComment, setOpenComment] = useState(false);
  const [commentPostId, setCommentPostId] = useState("");
  const [demo, setDemo] = useState(0);

  // const getPostsUrl = useSelector((store) => store.userInfo.userPostsUrl);

  // console.log("INSIDE PROFILE POST", posts.length);
  async function handleDelete(postId) {
    try {
      //delte from cloud storage
      console.log("handleing delte2");

      const postRef = ref(storage, `posts/${postId}`);
      await deleteObject(postRef);

      // delete from posts firestore
      console.log("handleing delte3");

      await deleteDoc(doc(firestore, "posts", postId));

      //delte postid from users data
      console.log("handleing delte4");

      const res = await isUserPresent("uid", "==", userId);
      let arr = res?.posts;
      let idx = arr.indexOf(postId);
      arr.splice(idx, 1);

      await modifyUserData(
        {
          posts: arr,
        },
        userId
      );
      console.log("handleing delte5");
      setDemo(demo + 1);
    } catch (error) {
      alert(error.message);
    }
  }
  async function handleCommentBox(postId) {
    setOpenComment(true);
    setCommentPostId(postId);
  }
  async function handleComment(a) {
    try {
      await useAddComment(a, commentPostId, loggedInUser?.uid);
    } catch (error) {
      alert(err.message);
    }
  }
  useEffect(() => {
    try {
      // dispatch(updateUserPosts(false));
      async function getUserPost() {
        const activeUserData = await isUserPresent("uid", "==", userId);
        const activeUserPostIds = await activeUserData.posts;
        console.log("getting user post1");
        setTest([]);

        await activeUserPostIds.forEach(async (val) => {
          setTest([]);
          console.log("getting user post2");

          const docRef = doc(firestore, "posts", val);
          getDoc(docRef).then((docSnap) => {
            //  dispatch(updateUserPosts(docSnap.data()));
            // console.log(test.length);
            setTest((prev) => [...prev, docSnap.data()]);
          });
        });
      }
      getUserPost();
    } catch (error) {
      alert(error.message);
    }
  }, [userId, posts, demo]);
  // useEffect(() => {
  //   console.log("dispatching posts");
  //   dispatch(updateUserPosts(test));
  // }, [test]);

  // if (getPostsUrl != null && getPostsUrl.length > 0) {
  console.log("PROFILE POST CONTAINER RENDERED", test);

  if (test.length == 0) {
    return (
      <div>
        <ProfileShimmer numberOfPosts={props?.numberOfPosts} />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center mt-12 ">
      {test
        .sort((a, b) => b?.createdAt - a?.createdAt)
        .map((url) => (
          <ProfilePost url={url} handleDelete={handleDelete} handleCommentBox={handleCommentBox} />
        ))}
      {openComment && (
        <CommentContainer
          close={setOpenComment}
          postId={commentPostId}
          posting={{ handleComment }}
        />
      )}
    </div>
  );
};

export default ProfilePostContainer;
