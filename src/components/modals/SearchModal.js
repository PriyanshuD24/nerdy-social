import React, { useContext, useState } from "react";
import SuggestionCard from "../SuggestionCard";
import { FSContext } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import Suggestion from "../Suggestion";

const SearchModal = (props) => {
  const { search, setSearch } = props.data;
  const { isUserPresent } = useContext(FSContext);
  const [uName, setUname] = useState("");
  const [data, setData] = useState(null);
  function handleClick() {
    isUserPresent("userName", "==", uName).then((res) => {
      console.log("res is ", res);
      setData(res);
    });
  }
  return (
    <>
      {search == true && (
        <div className="fixed top-0 right-0 bottom-0 left-0 bg-black opacity-85"></div>
      )}
      <div className=" space-y-4 p-3 z-20 fixed top-[20%] left-[50%] -translate-x-[50%]  bg-black min-w-80 border  rounded-lg shadow   border-gray-700">
        <div className="flex justify-between gap:32 md:gap-56 ">
          <div>Search user</div>
          <div>
            <button id="search-cross-button" onClick={() => setSearch(false)}>
              <svg
                className="h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z" />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <div>Username</div>
          <div className="">
            <input
              type="text"
              className="w-full text-black"
              onChange={(e) => {
                setUname(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={handleClick}>Search</button>
        </div>
        {data == null && (
          <div className="lg:hidden">
            <Suggestion />
          </div>
        )}
        {data != null && (
          <div
            onClick={() => {
              // document.querySelector(".cross-button").click();
            }}
          >
            <SuggestionCard data={data} />
          </div>
        )}
      </div>
    </>
  );
};

export default SearchModal;
