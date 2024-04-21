import { doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { firestore } from "../../firebase/firebase";
const useDislike = async (postId, myId) => {
  console.log("dislikes starts", postId, myId);

  const docRef = doc(firestore, "posts", postId);
  const postData = await getDoc(docRef);
  console.log("dislikesaddlkes starts", postId, myId, postData.data());
  let arr = postData.data().likes;
  console.log("arr is ", arr);
  let idx = arr.indexOf(myId);
  console.log("idx is ", idx);

  arr.splice(idx, 1);
  let obj = {
    likes: arr,
  };
  console.log("obj is ", obj);

  await updateDoc(docRef, obj);
  console.log("dislikes ends");
};

export default useDislike;
