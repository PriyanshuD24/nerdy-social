// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { createContext } from "react";
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";

// import {useNavigate} from "react-router-dom";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MSG_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
// const navigate=useNavigate();
const google = new GoogleAuthProvider(app);
google.setCustomParameters({
  prompt: "select_account",
});
export const FSContext = createContext();
export const FSProvider = (props) => {
  return (
    <FSContext.Provider
      value={{
        signUp,
        signIn,
        signInWithGoogle,
        logOut,
        isUserPresent,
        addUser,
        modifyUserData,
        imageUpload,
        listAllPosts,
      }}
    >
      {props.children}
    </FSContext.Provider>
  );
};

// functionality
// authentication
async function signUp(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}
async function signIn(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}
async function signInWithGoogle() {
  return await signInWithPopup(auth, google);
  //  await getRedirectResult(auth);
  // await signInWithRedirect(auth, google);
  // const result = await getRedirectResult(auth);
  // return result;
}

async function logOut() {
  return await signOut(auth);
}

// db

//checking if user is present
async function isUserPresent(uid, cond, userId) {
  const q = query(collection(firestore, "users"), where(uid, cond, userId));
  const qsnaps = await getDocs(q);

  var data = null;
  await qsnaps.forEach((val) => {
    // console.log("val is ", val.data());

    data = val.data();
  });

  return data;
}
//add new user
async function addUser(user, fname = null, uname = null) {
  // const userSignup =["!", "2"];
  // console.log("ADD_USER");

  // console.log(user);
  let collRef = collection(firestore, "users");
  let obj = {
    uid: user.uid,
    userName: user.email.split("@")[0],
    email: user.email,
    fullName: user.displayName,
    profilePicUrl: user.photoURL,
    bio: "",
    createdAt: "",
    followers: [], //uid
    following: [], //uid
    posts: [], //postid
  };
  if (fname != null) {
    obj.fullName = fname;
    obj.userName = uname;
  }
  const res = await addDoc(collRef, { ...obj });
  return obj;
}

//update user data

async function modifyUserData(obj, userId) {
  const q = query(collection(firestore, "users"), where("uid", "==", userId));
  const qdata = await getDocs(q);
  // console.log("qdata is", qdata);
  var key;
  qdata.forEach((val) => {
    // console.log(val._key.path.segments[6]);
    key = val._key.path.segments[6];
  });
  // console.log(key);
  let docRef = doc(firestore, "users", key);
  console.log("docRef is", docRef);
  return await updateDoc(docRef, obj);
}

// files upload

async function imageUpload(userId, img) {
  const rand = Math.ceil(Math.random() * 100);
  const imageRef = ref(storage, `posts/${userId}/${img.name}${rand}`);
  const value = await uploadBytes(imageRef, img);
  //console.log(value);
  //value.metadata.md5Hash    //post id
  const url = await getDownloadURL(value.ref);
  return [value.metadata.md5Hash, url]; // postid, url
}

async function listAllPosts(userId) {
  // return list of urls of all posts
  const imageListRef = ref(storage, `posts/${userId}/`);
  const res = await listAll(imageListRef);
  // console.log("result is ", res);
  return res;
}
