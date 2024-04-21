import { firestore } from "../../firebase/firebase";

import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

const useUnfollow = async (unfollowId, yourId) => {
  //   const { isUserPresent, modifyUserData } = useContext(FSContext);
  //   const dispatch = useDispatch();
  console.log("calling useUnfollow");
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
  const enemyData = await isUserPresent("uid", "==", unfollowId);

  const yourFollowing = await yourData?.following;
  const enemyFollowers = await enemyData?.followers;
  let idx;
  idx = yourFollowing.indexOf(unfollowId);
  yourFollowing.splice(idx, 1);
  idx = enemyFollowers.indexOf(yourId);
  enemyFollowers.splice(idx, 1);

  //update new data to firebase
  await modifyUserData(
    {
      following: yourFollowing,
    },
    yourId
  );
  await modifyUserData(
    {
      followers: enemyFollowers,
    },
    unfollowId
  );

  //updating new data to store
  //   const updatedData = await isUserPresent("uid", "==", yourId);
  //   dispatch(updateUserData(updatedData));
  console.log("useUnfollow called");
};

export default useUnfollow;
