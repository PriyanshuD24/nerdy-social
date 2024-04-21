import React, { useContext, useEffect, useState } from "react";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { FSContext, firestore } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import useUnfollow from "./hooks/useUnfollow";
import { updateUserData } from "./redux/UserSlice";
import { Link, useNavigate } from "react-router-dom";
import useAddLikes from "./hooks/useAddLikes";
import useDislike from "./hooks/useDislike";
import useAddComment from "./hooks/useAddComment";
import { collection, getDocs } from "firebase/firestore";
import { get } from "firebase/database";
import CommentModal from "./modals/CommentModal";
import CommentContainer from "./modals/CommentContainer";
import timeAgo from "./utils/timeAgo";
const FeedPostCard = (props) => {
  const time = timeAgo(props?.data?.createdAt);
  const userId = props?.data?.createdBy;
  const [info, setInfo] = useState(null);
  const { isUserPresent } = useContext(FSContext);
  const loggedInUser = useSelector((store) => store.userInfo.userData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [cmntText, setCmntText] = useState("");
  const [openComment, setOpenComment] = useState(false);
  const navigate = useNavigate();
  let [commentNumber, setCommentNumber] = useState([]);
  let [likes, setLikes] = useState(props?.data?.likes?.length);
  let [isAlreadyLiked, setIsAlreadyLiked] = useState(
    props?.data?.likes.includes(loggedInUser?.uid) ? true : false
  );

  // function timeAgo(timestamp) {
  //   const now = new Date();
  //   const secondsAgo = Math.floor((now - timestamp) / 1000);
  //   if (secondsAgo < 60) {
  //     return `${secondsAgo}s ago`;
  //   } else if (secondsAgo < 3600) {
  //     const minutesAgo = Math.floor(secondsAgo / 60);
  //     return `${minutesAgo}m ago`;
  //   } else if (secondsAgo < 86400) {
  //     const hoursAgo = Math.floor(secondsAgo / 3600);
  //     return `${hoursAgo}h ago`;
  //   } else if (secondsAgo < 604800) {
  //     const daysAgo = Math.floor(secondsAgo / 86400);
  //     return `${daysAgo}d ago`;
  //   } else {
  //     const weeksAgo = Math.floor(secondsAgo / 604800); // 7 days in seconds
  //     return `${weeksAgo}w ago`;
  //   }
  // }
  async function handleLikes() {
    try {
      // console.log("handle click starts");
      setLikes(++likes);
      setIsAlreadyLiked(true);
      const x = await useAddLikes(props?.data?.id, loggedInUser?.uid);
      // console.log("handle click ends");
    } catch (error) {
      setLikes(--likes);
      setIsAlreadyLiked(false);
      alert(error.message);
    }
  }

  async function handleDislike() {
    try {
      console.log("handle disclick starts");
      setLikes(--likes);
      setIsAlreadyLiked(false);
      await useDislike(props?.data?.id, loggedInUser?.uid);
      console.log("handle disclick ends");
    } catch (err) {
      setLikes(++likes);
      setIsAlreadyLiked(true);
    }
  }

  async function handleComment(a) {
    try {
      // let txt = document.querySelector("#comment-box").value;
      console.log("a is ", typeof a);
      console.log("comment text is ", cmntText);

      if (typeof a == "string") await useAddComment(a, props?.data?.id, loggedInUser?.uid);
      else await useAddComment(cmntText, props?.data?.id, loggedInUser?.uid);
    } catch (err) {
      setCommentNumber(--commentNumber);
      alert(err.message);
    } finally {
      setCmntText("");
      setCommentNumber(++commentNumber);
    }
  }
  useEffect(() => {
    try {
      //  if (commentData == null) {
      const collRef = collection(firestore, `posts/${props?.data?.id}/comments`);
      getDocs(collRef).then((val) => {
        setCommentNumber(val.size);
      });
      //  }
    } catch (error) {
      alert(error.message);
    }
  }, []);

  if (info == null) {
    async function getName() {
      const data = await isUserPresent("uid", "==", userId);
      // console.log("data");
      setInfo(data);
    }
    getName();
  }
  // console.log("info is ", info, props);
  // console.log("comment data", commentNumber);

  return (
    <div className=" p-2 py-3 space-y-3 border-slate-800 border-2 mb-5">
      {/* header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8">
            <Link to={"/" + info?.uid}>
              {" "}
              <img
                src={info?.profilePicUrl ? info?.profilePicUrl : "https://picsum.photos/200"}
                alt=""
                className="rounded-full w-8 h-8  object-cover "
              />
            </Link>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center">
            <Link to={"/" + info?.uid}>
              {" "}
              <div>{info?.userName} &nbsp;</div>{" "}
            </Link>
            <div className="text-slate-500 text-sm">• {time}</div>
          </div>
        </div>

        {/* {loading ? (
          <button
            disabled
            type="button"
            class="py-2.5 px-[10px] me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              role="status"
              class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
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
                fill="#1C64F2"
              />
            </svg>
            Loading...
          </button>
        ) : (
          <button
            onClick={() => {
              setLoading(true);
              props?.handleClick(info?.uid, loggedInUser?.uid);
              // setLoading(false);
            }}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-green-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75  bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Unfollow
            </span>
          </button>
        )} */}

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
            onClick={async () => {
              setLoading(true);
              await props?.handleClick(info?.uid, loggedInUser?.uid);
              setLoading(false);
            }}
            className="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-green-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75  bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Unfollow
            </span>
          </button>
        )}
      </div>

      {/* image */}
      <div
        className=""
        onDoubleClick={(e) => {
          // window.location.href = `${props.data.imgUrl}`;
          window.open(`${props.data.imgUrl}`, "_blank");
        }}
      >
        <img
          src={props?.data?.imgUrl}
          alt=""
          className="w-[100%] h-[350px] sm:h-[400px] object-cover"
        />
      </div>

      {/* logos */}
      <div className="flex gap-10 ">
        <span className="scale-150 hover:cursor-pointer">
          {isAlreadyLiked ? (
            <IoIosHeart color="red" onClick={handleDislike} />
          ) : (
            <IoIosHeartEmpty onClick={handleLikes} />
          )}{" "}
          {/* <IoIosHeartEmpty color="red" /> */}
        </span>
        <span className="scale-150 hover:cursor-pointer" onClick={() => setOpenComment(true)}>
          <FaRegComment color="green" />
        </span>
      </div>

      {/* likes */}

      <div>
        <span>{likes}</span> likes
      </div>

      {/* caption */}
      <div className="space-x-1">
        <Link to={"/" + info?.uid}>
          {" "}
          <span className="font-semibold">{info?.userName} </span>
        </Link>
        <span>{props?.data?.caption}</span>
      </div>

      <button onClick={() => setOpenComment(true)}>view all {commentNumber} comments</button>
      <div className="flex justify-between items-center space-x-2">
        <input
          type="text"
          className="basis-full text-black px-1 py-1  rounded-sm"
          placeholder="Add a comment"
          value={cmntText}
          onChange={(e) => setCmntText(e.target.value)}
        />

        <button
          type="button"
          onClick={handleComment}
          className=" border focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-2 sm:px-5 py-1 text-center me-2  border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
        >
          Post
        </button>
        {/* <CommentContainer /> */}
        {openComment && (
          <CommentContainer
            close={setOpenComment}
            postId={props?.data?.id}
            posting={{ setCmntText, handleComment }}
          />
        )}
      </div>
    </div>
  );
};

export default FeedPostCard;

/**
 
const timeAgo = (timestamp) => {
	const now = Date.now();
	const secondsAgo = Math.floor((now - timestamp) / 1000);

	if (secondsAgo < 60) {
		return `${secondsAgo}s ago`;
	} else if (secondsAgo < 3600) {
		const minutesAgo = Math.floor(secondsAgo / 60);
		return `${minutesAgo}m ago`;
	} else if (secondsAgo < 86400) {
		const hoursAgo = Math.floor(secondsAgo / 3600);
		return `${hoursAgo}h ago`;
	} else if (secondsAgo < 604800) {
		const daysAgo = Math.floor(secondsAgo / 86400);
		return `${daysAgo}d ago`;
	} else {
		const weeksAgo = Math.floor(secondsAgo / 604800); // 7 days in seconds
		return `${weeksAgo}w ago`;
	}
};


timeAgo(post.createdAt)
 */
