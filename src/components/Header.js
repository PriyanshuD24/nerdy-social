import { Link, useNavigate } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { MdOutlineSearch } from "react-icons/md";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { IoCreateSharp } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";

import { useContext } from "react";
import { FSContext } from "../firebase/firebase";
import { useSelector, useDispatch } from "react-redux";
import { clearPosts, logout } from "./redux/UserSlice";
import { useParams } from "react-router-dom";

const Header = (props) => {
  console.log("HEADER");
  const { logOut } = useContext(FSContext);
  const navigate = useNavigate();
  const uid = useSelector((store) => store?.userInfo?.userData?.uid);
  const profilePicUrl = useSelector((store) => store?.userInfo?.userData?.profilePicUrl);

  // console.log("userData from redux  is", userData);

  const dispatch = useDispatch();

  return (
    <div className=" px-2  w-auto sm:w-40  my-4 ">
      <ul className="mt-14 space-y-6 flex justify-start items-center  w-auto flex-col">
        <li>
          <Link to="/home">
            <div className="   flex w-5 sm:w-24 rounded-full  justify-center items-center mb-7">
              <img
                src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?w=740&t=st=1713558236~exp=1713558836~hmac=ee1a553bc94ee23ed571a0dd283e8492dc00dbeac8d1a658f70de45f2e61fe04"
                alt="logo"
                className="rounded-full "
              />
            </div>
          </Link>
        </li>
        <li>
          <Link to="/home">
            {" "}
            <div
              className="hover:text-red-500 hover:cursor-pointer p-1.5 sm:w-full flex items-center gap-1 sm:scale-110  justify-center"
              onClick={() => props.data("home")}
            >
              {" "}
              <GoHome /> <span className="hidden sm:inline"> Home </span>{" "}
            </div>{" "}
          </Link>
        </li>
        <li
          className="hover:text-red-500 hover:cursor-pointer p-1.5 sm:w-full flex items-center gap-1 sm:scale-110  justify-center "
          onClick={() => props.search(true)}
        >
          <div className="scale-125">
            {" "}
            <MdOutlineSearch />{" "}
          </div>{" "}
          <span className="hidden sm:inline">Search</span>
        </li>
        <li className="hover:text-red-500 hover:cursor-pointer p-1.5 sm:w-full flex items-center gap-1 sm:scale-110  justify-center ">
          {" "}
          <MdOutlineNotificationsActive /> <span className="hidden sm:inline">Notification</span>
        </li>
        <li
          className="hover:text-red-500 hover:cursor-pointer p-1.5 sm:w-full flex items-center gap-1 sm:scale-110  justify-center "
          onClick={() => props.newPost(true)}
        >
          <IoCreateSharp /> <span className="hidden sm:inline"> Create</span>
        </li>
        <Link to={"/" + uid}>
          <div
            className="hover:text-red-500 hover:cursor-pointer p-1.5 sm:w-full flex items-center gap-1 relative right-1 sm:scale-110  justify-center "
            onClick={() => {}}
          >
            <img
              src={
                profilePicUrl != null
                  ? profilePicUrl
                  : "https://blogtimenow.com/wp-content/uploads/2014/06/hide-facebook-profile-picture-notification.jpg"
              }
              alt="img"
              className="h-4 w-4 sm:w-5 sm:h-5 rounded-full object-cover"
            />{" "}
            <span className="hidden sm:inline">Profile</span>{" "}
          </div>
        </Link>

        <li
          className=" hover:text-red-500 hover:cursor-pointer p-1.5 w-full  "
          onClick={async () => {
            logOut().then(() => {
              // dispatch(clearPosts());
              dispatch(logout());
              navigate("/auth");
            });
          }}
        >
          <Link
            to="/auth"
            className="flex items-center gap-1 relative right-1 sm:right-0 sm:scale-110  justify-center  "
          >
            {" "}
            <RiLogoutBoxLine /> <span className="hidden sm:inline">Log out</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default Header;
