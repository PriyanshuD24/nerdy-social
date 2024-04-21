import React, { useContext, useEffect, useState } from "react";
import FeedPostCard from "./FeedPostCard";
import CommentModal from "./modals/CommentModal";
import { FSContext, firestore } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { updateFeedPosts, updateUserData } from "./redux/UserSlice";
import FeedShimmer from "./FeedShimmer";
import useUnfollow from "./hooks/useUnfollow";

const FeedPost = () => {
  const [showPosts, setShowPosts] = useState(null);
  const userData = useSelector((store) => store.userInfo.userData);
  const follow = useSelector((store) => store.userInfo.userData?.following);
  const dispatch = useDispatch();
  let [totalPostsLength, setTotalPostsLength] = useState(0);

  console.log("FEED POST IS HERE", showPosts, follow);

  const { isUserPresent } = useContext(FSContext);

  async function handleClick(unfollowId, myId) {
    try {
      console.log("unfollowed clicked");

      await useUnfollow(unfollowId, myId);
      let newUpdatedData = await isUserPresent("uid", "==", userData?.uid);

      dispatch(updateUserData(newUpdatedData));
      setShowPosts([]);
      console.log("unfollowed ended");
    } catch (error) {
      alert(error.message);
    } finally {
      setTotalPostsLength(0);
    }
  }

  useEffect(() => {
    console.log("FIRST");
    console.log("show post", showPosts);

    async function xyz() {
      userData?.following.forEach(async (followingId) => {
        console.log("for each 1");
        if (totalPostsLength != 0) {
          var x = totalPostsLength;
          for (let i = 0; i < x; i++) {
            console.log("caliing", totalPostsLength);
            setTotalPostsLength(--totalPostsLength);
          }
        }
        const dataOfFriends = await isUserPresent("uid", "==", followingId);
        const postsOfFriends = await dataOfFriends?.posts;
        console.log("POST OF FRIEND", postsOfFriends, totalPostsLength);
        // setTotalPostsLength(totalPostsLength + postsOfFriends.length);

        postsOfFriends.forEach(async (postId) => {
          console.log("for each 2");
          setTotalPostsLength(++totalPostsLength);

          const docRef = doc(firestore, "posts", postId);
          const postData = await getDoc(docRef);
          setShowPosts((prev) => [...prev, postData.data()]);
        });
      });
    }
    console.log("total post lengthh is ", totalPostsLength);
    setTotalPostsLength(0);
    setShowPosts([]);
    xyz();
  }, [follow]);

  if (showPosts?.length == totalPostsLength && showPosts?.length != 0) {
    console.log("rendering", showPosts?.length, totalPostsLength);
    return (
      <div className=" space-y-4">
        {showPosts
          .sort((a, b) => b?.createdAt - a?.createdAt)
          .map((data) => (
            <FeedPostCard data={data} handleClick={handleClick} />
          ))}

        {/* <CommentModal /> */}
      </div>
    );
  }

  console.log(showPosts?.length, totalPostsLength);
  return (
    <div className="">
      <FeedShimmer />
      {/* <FeedShimmer /> */}
      {/* <FeedShimmer /> */}
    </div>
  );
};

export default FeedPost;
