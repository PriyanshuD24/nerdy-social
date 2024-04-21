import { addDoc, collection, doc } from "firebase/firestore";
import React from "react";
import { firestore } from "../../firebase/firebase";

const useAddComment = async (text, postId, userId) => {
  //  postid=> onwhich post comment is made
  // userId=> by whom commnet is posted ie loggedin user
  console.log("add cmnt stars", text);

  let obj = {
    comment: text,
    createdBy: userId,
    postId: postId,
    createdAt: Date.now(),
  };

  let collRef = collection(firestore, `posts/${postId}/comments`);
  await addDoc(collRef, obj);
  console.log("add cmnt ends");
};

export default useAddComment;
