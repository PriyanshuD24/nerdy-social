import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const useFollow = async (friendId, yourId) => {
  console.log("useFollow called");
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

  const yourData = await isUserPresent("uid", "==", yourId);
  const friendData = await isUserPresent("uid", "==", friendId);

  const yourFollowing = await yourData?.following;
  const friendFollowers = await friendData?.followers;
  yourFollowing.push(friendId);
  friendFollowers.push(yourId);
  await modifyUserData(
    {
      following: yourFollowing,
    },
    yourId
  );
  await modifyUserData(
    {
      followers: friendFollowers,
    },
    friendId
  );
  console.log("useFollow end");
};

export default useFollow;
