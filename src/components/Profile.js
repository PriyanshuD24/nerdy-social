import { Link, useParams } from "react-router-dom";
import ProfilePostContainer from "./ProfilePostContainer";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { FSContext, firestore } from "../firebase/firebase";
import EditProfile from "./modals/EditProfile";
import { doc, getDoc } from "firebase/firestore";
import useFollow from "./hooks/useFollow";
import { updateUserData } from "./redux/UserSlice";
import useUnfollow from "./hooks/useUnfollow";

const Profile = (props) => {
  console.log("PROFILE RENDERED");
  const dispatch = useDispatch();
  const [userData, setUserData] = useState([]);
  const user = useSelector((store) => store.userInfo?.user); // codeanonymous
  const userdata = useSelector((store) => store.userInfo?.userData); //codeanonymous
  const { isUserPresent } = useContext(FSContext);
  const [editProfile, setEditProfile] = useState(false);
  // const [posts, setPosts] = useState([]);
  const [follow, setFollow] = useState(false);
  let [numFollow, setNumFollow] = useState(null);
  const { userId } = useParams();
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   async function xyz() {
  //     const data = await isUserPresent("uid", "==", userId);
  //     setUserData(data);
  //   }
  //   xyz();
  // }, [userId]);
  async function handleFollowUnfollow() {
    // setLoading(true);

    if (follow) {
      setFollow(!follow);
      setNumFollow(--numFollow);
      await useUnfollow(userData?.uid, userdata?.uid);
    } else {
      setFollow(!follow);
      setNumFollow(++numFollow);

      await useFollow(userData?.uid, userdata?.uid);
    }

    const updatedData = await isUserPresent("uid", "==", userdata?.uid);
    await dispatch(updateUserData(updatedData));
    // setLoading(false);
  }
  useEffect(() => {
    async function xyz() {
      const data = await isUserPresent("uid", "==", userId);
      setUserData(data);
    }

    xyz();
    // getUserPostUrl();
    // }
  }, [userdata, userId]);

  useEffect(() => {
    console.log("USEEFFECT", userdata?.following);
    userdata?.following?.includes(userId) ? setFollow(true) : setFollow(false);
  }, []);
  useEffect(() => {
    console.log("USEEFFECT new", numFollow, userData?.followers?.length);

    if (numFollow == null && userData?.followers?.length != undefined) {
      console.log("USEEFFECT new", numFollow, userData?.followers?.length);

      setNumFollow(userData?.followers?.length);
    }
  });
  // console.log("profile rendered", userdata);
  return (
    <div className="flex flex-col gap-10 justify-center items-center mx-auto  max-w-[300px] sm:max-w-96 md:max-w-[600px] lg:max-w-[800px] relative  sm:left-8 md:left-8 lg:left-8 xl:left-0  ">
      <div className="profile-header flex gap-5 justify-center  flex-wrap">
        <div className="w-20">
          <img
            src={
              userData?.profilePicUrl != null
                ? userData?.profilePicUrl
                : "https://blogtimenow.com/wp-content/uploads/2014/06/hide-facebook-profile-picture-notification.jpg"
            }
            onDoubleClick={(e) => {
              // window.location.href = `${props.data.imgUrl}`;
              window.open(`${userData?.profilePicUrl}`, "_blank");
            }}
            className="  w-20 h-20 object-cover rounded-full"
            alt=""
          />
        </div>
        <div className="flex flex-col gap-4  ">
          <div className="flex gap-3 items-center justify-around sm:justify-between">
            <span className="">
              {userData?.userName ? userData?.userName : "Lorem, ipsum."} &nbsp;
            </span>
            {user?.uid == userId ? (
              <button
                onClick={() => setEditProfile(true)}
                className="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-green-800"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75  bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Edit Profile
                </span>
              </button>
            ) : (
              <button
                onClick={handleFollowUnfollow}
                className="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-green-800"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75  bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  {follow ? "Unfollow" : "Follow"}
                </span>
              </button>
            )}
          </div>

          <div className="flex gap-4 justify-center sm:justify-normal ">
            <span>{userData?.posts?.length} Posts</span>
            <span>{numFollow} Followers</span>
            <span>{userData?.following?.length} Following</span>
          </div>
          <div className="font-semibold text-sm text-center sm:text-justify">
            {userData?.fullName}
          </div>
          <div className="w-full text-center sm:text-justify">
            {userData?.bio ? userData?.bio : "write your bio"}
          </div>
        </div>
      </div>
      <div className="profile-footer">
        <div className="flex gap-10 justify-center items-center border-t-[1px] border-slate-700  ">
          <div className="border-t-[1px] py-3 px-1">
            <button>POSTS</button>
          </div>
          <div className="py-3 px-1">
            <button>SAVED</button>
          </div>
          <div className="py-3 px-1">
            <button>LIKES</button>
          </div>
        </div>

        <ProfilePostContainer numberOfPosts={userData?.posts?.length} />
      </div>
      {editProfile && <EditProfile data={{ editProfile, setEditProfile }} />}
    </div>
  );
};

export default Profile;
