import React, { useContext, useEffect, useState } from "react";
import SuggestionCard from "./SuggestionCard";
import { Link } from "react-router-dom";
import { FSContext, firestore } from "../firebase/firebase";
import { useSelector } from "react-redux";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

const Suggestion = () => {
  const { isUserPresent } = useContext(FSContext);
  const [data, setData] = useState([]);
  const userData = useSelector((store) => store.userInfo.userData);
  const following = useSelector((store) => store.userInfo.userData?.following);
  const [loading, setLoading] = useState(false);

  // console.log("suggestion data", data);

  // if (data == null) {
  //   console.log("inside log");
  //   isUserPresent("uid", "!=", userData?.uid).then((response) => {
  //     console.log("response is ", response);
  //     setData(response);
  //   });
  // }

  useEffect(() => {
    setData([]);
    async function SuggestedUsers() {
      const collRef = collection(firestore, "users");
      const q = query(
        collRef,
        where("uid", "not-in", [userData?.uid, ...userData?.following]),
        limit(4)
      );
      const qsnaps = await getDocs(q);
      setData([]);
      qsnaps.forEach((val) => setData((previous) => [...previous, val.data()]));
    }

    SuggestedUsers().catch((err) => {});
  }, [following]);

  return (
    <div className="w-full max-w-md px-2 py-4 xl:p-8  border  rounded-lg shadow   border-gray-700">
      <div className="flex items-center justify-between mb-4 gap-16">
        <h5 className="text-xl font-bold leading-none  text-white">Suggested for you</h5>
        <div className="text-sm font-medium hover:underline text-blue-500">see all</div>
      </div>
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-700">
          {data.map((data) => (
            <SuggestionCard data={data} />
          ))}
        </ul>
      </div>
      <div className="text-center mt-3 ">
        &copy; 2024 build by{" "}
        <Link
          to="https://github.com/PriyanshuD24"
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          Priyanshu
        </Link>
      </div>
    </div>
  );
};

export default Suggestion;

//--------------------------------------
{
  /* <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Suggested for you</h5>
        <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
           see all
        </a>
   </div>
   <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="py-3 sm:py-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image">
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Neil Sims
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            email@windster.com
                        </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $320
                    </div>
                </div>
            </li>
            <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                    <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Bonnie image">
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Bonnie Green
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            email@windster.com
                        </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $3467
                    </div>
                </div>
            </li>
            <li className="py-3 sm:py-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-2.jpg" alt="Michael image">
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Michael Gough
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            email@windster.com
                        </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $67
                    </div>
                </div>
            </li>
            <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                    <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-4.jpg" alt="Lana image">
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Lana Byrd
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            email@windster.com
                        </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $367
                    </div>
                </div>
            </li>
            <li className="pt-3 pb-0 sm:pt-4">
                <div className="flex items-center ">
                    <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-5.jpg" alt="Thomas image">
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Thomes Lean
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            email@windster.com
                        </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $2367
                    </div>
                </div>
            </li>
        </ul>
   </div>
</div> */
}
