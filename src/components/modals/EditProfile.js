import { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FSContext, storage } from "../../firebase/firebase";
import { updateUserData } from "../redux/UserSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
const EditProfile = (props) => {
  const { editProfile, setEditProfile } = props.data;
  let isOpen = editProfile;
  function onClose() {
    setEditProfile(false);
  }
  console.log("Edit profile rendered");

  const userData = useSelector((store) => store.userInfo.userData);
  const { fullName, userName, bio, uid, profilePicUrl } = userData;
  const [fname, setFname] = useState(fullName);
  const [uname, setUname] = useState(userName);
  const [about, setAbout] = useState(bio);
  const [profilePic, setProfilePic] = useState(null);
  const { modifyUserData, isUserPresent } = useContext(FSContext);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  async function handleSubmit() {
    try {
      setLoading(true);
      let obj = {
        fullName: fname,
        userName: uname,
        bio: about,
      };
      if (profilePic) {
        console.log("Profile pic is ", profilePic);
        const storageRef = ref(storage, `profilePics/${userData?.uid}`);
        const uploadRef = await uploadBytes(storageRef, profilePic);
        const dpUrl = await getDownloadURL(uploadRef.ref);
        console.log("url is", dpUrl);
        obj.profilePicUrl = dpUrl;
        console.log("object is ", obj);
      }
      await modifyUserData(obj, uid);
      await isUserPresent("uid", "==", uid).then((val) => {
        dispatch(updateUserData(val));
        setEditProfile(false);
        setProfilePic(null);
      });

      setLoading(false);
    } catch (error) {
      alert(error.message);
    }
  }
  async function handleProfilePic() {
    try {
      document.querySelector("#dp").click();
      console.log(profilePic);
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <>
      <div className={`fixed   flex items-center justify-center  ${isOpen ? "block" : "hidden"}`}>
        <div className="fixed  inset-0 bg-black opacity-80 z-50"></div>
        <div className="relative bg-black border-1 border-gray-500 shadow-xl z-[100] mx-3">
          <div className="flex justify-between p-6">
            <div></div> {/* ModalHeader */}
            <button onClick={onClose} className="absolute top-0 right-0 mt-2 mr-2 text-white">
              <svg
                className="h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z" />
              </svg>
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="flex bg-black">
              <div className="w-full max-w-md bg-black p-6">
                <h2 className="text-3xl sm:text-4xl leading-tight">Edit Profile</h2>
                <div className="mt-6">
                  <div className="flex space-x-6 items-center">
                    <div className="flex-shrink-0">
                      <img
                        src={
                          profilePicUrl != null
                            ? userData?.profilePicUrl
                            : "https://blogtimenow.com/wp-content/uploads/2014/06/hide-facebook-profile-picture-notification.jpg"
                        }
                        alt="Profile Picture"
                        className="h-20 w-20 object-cover rounded-full border-2 border-white"
                      />
                    </div>
                    <div className="flex-grow">
                      <input
                        type="file"
                        name=""
                        id="dp"
                        className="hidden"
                        onChange={(e) => {
                          // console.log("file is ", e.target.files[0]);
                          setProfilePic(e.target.files[0]);
                          // console.log("file is ", profilePic);
                        }}
                        onClick={(e) => {
                          // console.log("file is ", e.target.files[0]);
                          setProfilePic(e.target.files[0]);
                          // console.log("file is ", profilePic);
                        }}
                      />
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-full"
                        onClick={() => {
                          document.querySelector("#dp").click();
                        }}
                      >
                        Edit Profile Picture
                      </button>
                      {profilePic && <span>✔️</span>}
                    </div>
                  </div>
                  <div className="mt-6">
                    <label htmlFor="full-name" className="block text-sm font-medium text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full-name"
                      id="full-name"
                      className="mt-1 block text-black  w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      value={fname}
                      onChange={(e) => setFname(e.target.value)}
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      className="mt-1 block  text-black w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      value={uname}
                      onChange={(e) => setUname(e.target.value)}
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
                      Bio
                    </label>
                    <input
                      type="text"
                      name="bio"
                      id="bio"
                      className="mt-1 block  text-black w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-6 flex space-x-4 justify-between">
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  {loading ? (
                    <div role="status">
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
                      className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
