import React, { useEffect, useState } from "react";
import CommentModal from "./CommentModal";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const CommentContainer = (props) => {
  const [hide, sethide] = useState("fixed");
  const [comment, setComment] = useState([]);
  const postId = props.postId;
  const [commentText, setCommentText] = useState("");
  const [postClicked, setPostClicked] = useState(false);
  const { handleComment } = props?.posting;
  console.log(postId);
  //   debugger;
  function handlePost() {}

  useEffect(() => {
    async function fn() {
      const collRef = collection(firestore, `posts/${postId}/comments`);
      getDocs(collRef).then((snaps) => {
        setComment([]);
        snaps.forEach((val) => {
          console.log(val.data());
          setComment((prev) => [...prev, val.data()]);
        });
      });
    }
    fn();
  }, [postClicked]);
  useEffect(() => {
    var objDiv = document.getElementById("comment-container");
    objDiv.scrollTop = objDiv.scrollHeight; // scroll top means upr se kitni height chahiye scrool m
  });

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 bottom-0 bg-black opacity-80 z-10`}></div>

      <div
        className={`flex flex-col fixed top-[20%] left-[50%] -translate-x-[50%]   min-w-[320px] sm:min-w-[500px]  justify-center items-center bg-black space-y-5 z-20 text-white border  rounded-lg shadow   border-gray-700 p-2 `}
      >
        <div className="text-white flex justify-between w-full">
          <div className="text-xl">All Comments</div>
          <div className="">
            <button
              onClick={() => {
                console.log("called", hide);

                props.close(false);
                sethide("hidden");
              }}
            >
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
        <div className="h-60 space-y-2 w-[100%] overflow-y-scroll px-2 py-1" id="comment-container">
          {comment
            .sort((a, b) => a?.createdAt - b?.createdAt)
            .map((val) => (
              <CommentModal data={val} />
            ))}
        </div>
        <div className=" w-[100%] flex gap-2">
          <input
            type="text"
            className="text-black basis-full px-1 py-1  rounded-sm"
            value={commentText}
            placeholder="Add a comment"
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="button"
            onClick={async () => {
              await handleComment(commentText);
              setCommentText("");
              setPostClicked(!postClicked);
            }}
            className=" border focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-2 sm:px-5 py-1 text-center me-2  border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800"
          >
            Post
          </button>
        </div>
      </div>
    </>
  );
};

export default CommentContainer;
