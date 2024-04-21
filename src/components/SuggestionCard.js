import React, { useContext, useEffect, useState } from "react";
import { FSContext } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateUserData } from "./redux/UserSlice";

const SuggestionCard = (props) => {
  // const { isUserPresent } = useContext(FSContext);
  // // const userData = useSelector((store) => store.userInfo.userData);
  // // const [showData, setShowData] = useState(null);
  // // useEffect(() => {
  // //   isUserPresent("uid", "nKD2XulcobXJ74y004nO2A2vdt23").then((data) => {
  // //     setShowData(data);
  // //   });
  // // }, []);
  const showData = props.data;
  const following = useSelector((store) => store.userInfo.userData?.following);
  // const followers = useSelector((store) => store.userInfo.userData?.followers);
  const loggedInUserId = useSelector((store) => store.userInfo.user?.uid);
  const [isFollow, setIsFollow] = useState(true);
  const { modifyUserData, isUserPresent } = useContext(FSContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // console.log(following);
  if (following?.includes(showData?.uid) && isFollow == true) setIsFollow(false);

  async function handleClick() {
    setLoading(true);
    if (isFollow) {
      // updating your following
      let arr = [...following];
      arr.push(showData?.uid);
      let obj = {
        following: arr,
      };
      await modifyUserData(obj, loggedInUserId);
      //updating their followers
      arr = showData?.followers;
      arr.push(loggedInUserId);
      obj = {
        followers: arr,
      };
      setIsFollow(false);
      await modifyUserData(obj, showData?.uid);
    } else {
      let arr = [...following];
      let idx = arr.indexOf(showData?.uid);
      arr.splice(idx, 1);
      let obj = {
        following: arr,
      };
      await modifyUserData(obj, loggedInUserId);
      //updating their followers
      arr = showData?.followers;
      idx = arr.indexOf(loggedInUserId);
      arr.splice(idx, 1);
      // arr.push(loggedInUserId);
      obj = {
        followers: arr,
      };

      await modifyUserData(obj, showData?.uid);
      setIsFollow(true);
    }
    // redux update;
    const data = await isUserPresent("uid", "==", loggedInUserId);
    dispatch(updateUserData(data));
    setLoading(false);
    document.querySelector("#search-cross-button")?.click();
  }

  if (showData != null) {
    return (
      <li className="py-3 sm:py-4 list-none">
        <div className="flex items-center justify-between w-full">
          <div className="flex">
            <div className="flex-shrink-0">
              <Link to={"/" + showData?.uid}>
                {" "}
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={showData?.profilePicUrl}
                  alt="Neil image"
                />
              </Link>
            </div>
            <div className="flex-1 min-w-0 ms-4 mr-4">
              <Link to={"/" + showData?.uid}>
                {" "}
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  {showData?.userName}
                </p>
              </Link>
              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                {showData?.followers?.length} followers
              </p>
            </div>
          </div>

          <div className="inline-flex items-center justify-center text-base font-semibold text-gray-900 dark:text-white">
            {loading ? (
              <div role="status " className="w-20">
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
                onClick={handleClick}
                className="relative inline-flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-green-800"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75  bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  {isFollow ? "Follow" : "Unfollow"}
                </span>
              </button>
            )}
          </div>
        </div>
      </li>
    );
  }
};

export default SuggestionCard;
