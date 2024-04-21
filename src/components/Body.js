import { useContext, useEffect, useState } from "react";
import Home from "./Home";
import Header from "./Header";
import Profile from "./Profile";
import SearchModal from "./modals/SearchModal";
import CreatePost from "./modals/CreatePost";
import EditProfile from "./modals/EditProfile";
import { useSelector, useDispatch } from "react-redux";
import { FSContext } from "../firebase/firebase";
import { updateUserData } from "./redux/UserSlice";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
// import { UserContext } from "../App";

const Body = () => {
  // console.log("BODY");

  const [active, setActive] = useState("home");
  const [search, setSearch] = useState(false);
  const [post, setPost] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((store) => store.userInfo.user);
  // console.log("user is :-", user);
  const signUpUser = useSelector((store) => store.userInfo.userSignUp);
  const { isUserPresent, addUser } = useContext(FSContext);

  // props.profile && active != "profile" ? setActive("profile") : 1;
  useEffect(() => {
    async function fn() {
      const data = await isUserPresent("uid", "==", user?.uid);
      if (data == null) {
        const data = await addUser(user, signUpUser[0], signUpUser[1]);
        dispatch(updateUserData(data));
        // setUserData(data);
      } else {
        if (data != undefined) dispatch(updateUserData(data));

        // setUserData(data)
      }
    }
    fn();
  }, []);

  function changeActive(value) {
    setActive(value);
  }
  return (
    <>
      <div className="flex pt-8 justify-center min-h-[100vh] ">
        <div className="basis-1/12 fixed left-0 top-0 z-[2]">
          <Header data={changeActive} search={setSearch} newPost={setPost} />
        </div>
        <div className=" ">
          <Outlet />
          {search == true && <SearchModal data={{ search, setSearch }} />}
          {post == true && <CreatePost data={{ post, setPost }} />}
        </div>
      </div>
    </>
  );
};
export default Body;
