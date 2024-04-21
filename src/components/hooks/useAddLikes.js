import { doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { firestore } from "../../firebase/firebase";

const useAddLikes = async (postId, myId) => {
  console.log("addlkes starts", postId, myId);

  const docRef = doc(firestore, "posts", postId);
  const postData = await getDoc(docRef);
  console.log("addlkes starts", postId, myId, postData.data());

  let obj = {
    likes: [...postData.data()?.likes, myId],
  };
  await updateDoc(docRef, obj);
  console.log("addlkes ends");
};

export default useAddLikes;
