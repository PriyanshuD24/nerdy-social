import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FSContext, auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, updateUserSignUp } from "./redux/UserSlice";

const Login = () => {
  console.log("LOGIN");
  // const x = useSelector((store) => store.userInfo.showFeedPosts);
  // console.log("checking", x);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [fullname, setFullname] = useState();
  const [userName, setUserName] = useState();
  const [login, SetLogin] = useState(false);
  const navigate = useNavigate();
  const { signUp, signIn, signInWithGoogle } = useContext(FSContext);
  const [err, setErr] = useState(null);
  var dispatch = useDispatch();

  useEffect(() => {
    // console.log("ONAUTH");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(updateUser(user));
        navigate("/home");
      }
    });
  }, []);

  return (
    <div className="flex justify-center items-center h-[100vh] gap-10   bg-[url('https://firebasestorage.googleapis.com/v0/b/insta-clone-84e3d.appspot.com/o/bgVideo%2Fpxfuel.jpg?alt=media&token=3b8a3a4f-457d-462f-a575-1b9e2c26589e')] bg-cover">
      {/* <div className="hidden md:block">
        <img src="https://social-app-asaprogrammer.vercel.app/auth.png" alt="img" />
      </div> */}
      <div className="flex flex-col justify-center items-center w-80 gap-3 bg-black bg-opacity-0 backdrop-blur-sm  ">
        <div className="flex flex-col justify-center items-center w-80 p-4 border-slate-600 rounded-md border-[1px] gap-3 ">
          <div>
            <img
              src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?w=740&t=st=1713558236~exp=1713558836~hmac=ee1a553bc94ee23ed571a0dd283e8492dc00dbeac8d1a658f70de45f2e61fe04"
              alt="logo"
              className="rounded-full w-28"
            />
          </div>
          <div className="w-full space-y-2">
            {login && (
              <>
                <input
                  className="w-full px-2 py-1.5 bg-transparent border-[1px] rounded border-slate-600 text-slate-500 focus:border-green-600   outline-none"
                  placeholder="fullname"
                  type="text"
                  onChange={(e) => {
                    setFullname(e.target.value);
                  }}
                />
                <input
                  className="w-full px-2 py-1.5 bg-transparent border-[1px] rounded border-slate-600 text-slate-500  focus:border-green-600  outline-none"
                  placeholder="username"
                  type="text"
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
              </>
            )}

            <input
              className="w-full px-2 py-1.5 bg-transparent border-[1px] rounded border-slate-600 text-slate-500 focus:border-green-600  outline-none"
              placeholder="email"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              className="w-full px-2 py-1.5 my-2 bg-transparent border-[1px] rounded border-slate-600 text-slate-500 focus:border-green-600   outline-none"
              placeholder="password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key == "Enter") {
                  if (login) {
                    signUp(email, password)
                      // .then((val) => navigate("/"))
                      .catch((err) => setErr(err.message));
                  } else {
                    signIn(email, password)
                      // .then((val) => navigate("/"))
                      .catch((err) => setErr(err.message));
                  }
                }
              }}
            />

            {/* <button
              className="w-full bg-cyan-700 rounded mt-1"
              onClick={() => {
                if (login) {
                  signUp(email, password)
                    .then((val) => dispatch(updateUserSignUp([fullname, userName])))
                    .catch((err) => setErr(err.message));
                } else {
                  signIn(email, password)
                    // .then((val) => navigate("/"))
                    .catch((err) => {
                      setErr(err.message);
                    });
                }
              }}
            >
              {login ? "SignUp" : "Login"}
            </button> */}
            <button
              onClick={() => {
                if (login) {
                  signUp(email, password)
                    .then((val) => dispatch(updateUserSignUp([fullname, userName])))
                    .catch((err) => setErr(err.message));
                } else {
                  signIn(email, password)
                    // .then((val) => navigate("/"))
                    .catch((err) => {
                      setErr(err.message);
                    });
                }
              }}
              className=" w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium  rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white text-white focus:ring-4 focus:outline-none  focus:ring-blue-800"
            >
              <span className=" w-full relative px-5 py-2.5 transition-all ease-in duration-75  bg-gray-900 rounded-md group-hover:bg-opacity-0">
                {login ? "SignUp" : "Login"}
              </span>
            </button>
          </div>
          <div className="w-full text-center text-red-500">{err}</div>
          <div className="w-full text-center">OR</div>
          <div className="w-full flex gap-3 items-center justify-center">
            {/* <img
              src="https://social-app-asaprogrammer.vercel.app/google.png"
              className="w-5"
              alt=""
            /> */}
            {/* <span
              className="hover:cursor-pointer text-blue-600"
              onClick={async () => {
                await signInWithGoogle()
                  .then((val) => {})
                  .catch((err) => setErr(err.message));
              }}
            >
              Log in with Google
            </span> */}
            <button
              onClick={async () => {
                await signInWithGoogle()
                  .then((val) => {})
                  .catch((err) => setErr(err.message));
              }}
              type="button"
              class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
            >
              <svg
                class="w-4 h-4 me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 19"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                  clip-rule="evenodd"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
        {!login && (
          <div className="border-[1px] border-slate-600 rounded-md w-full text-center py-4 ">
            Don't have an account?
            <span
              className="hover:cursor-pointer hover:underline text-blue-600"
              onClick={() => SetLogin(true)}
            >
              {" "}
              Sign up
            </span>
          </div>
        )}
        {login && (
          <div className="border-[1px] border-slate-600 rounded-md w-full text-center py-4 ">
            Already have account?
            <span className="hover:cursor-pointer text-blue-600" onClick={() => SetLogin(false)}>
              {" "}
              Login
            </span>
          </div>
        )}

        <div className="text-center ">Get the app</div>
        <div className="flex justify-around items-center w-full ">
          <div className="w-28">
            <img src="https://social-app-asaprogrammer.vercel.app/playstore.png" alt="" />
          </div>
          <div className="w-28">
            <img src="https://social-app-asaprogrammer.vercel.app/microsoft.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
