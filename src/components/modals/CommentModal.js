import React, { useContext, useEffect, useState } from "react";
import timeAgo from "../utils/timeAgo";
import { FSContext } from "../../firebase/firebase";
import { Link } from "react-router-dom";

const CommentModal = (props) => {
  const [info, setInfo] = useState(null);
  const time = timeAgo(props.data.createdAt);
  const { isUserPresent } = useContext(FSContext);
  useEffect(() => {
    async function fn() {
      const data = await isUserPresent("uid", "==", props.data.createdBy);
      setInfo(data);
    }
    fn();
  }, []);
  return (
    <div className="flex gap-4 ">
      {info == null ? (
        <div className="w-8 h-8 rounded-full object-cover bg-slate-700 animate-pulse"></div>
      ) : (
        <Link to={"/" + info?.uid}>
          {" "}
          <img
            src={info?.profilePicUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />{" "}
        </Link>
      )}

      <div className="flex flex-col">
        <div className="flex gap-2 items-center">
          <span className="font-bold text-sm">
            {info == null ? "username" : <Link to={"/" + info?.uid}>{info?.userName} </Link>}
          </span>
          <span className="text-xs text-gray-500 relative top-[1px]">{time}</span>
        </div>
        <span className="text-base">{props.data.comment}</span>
      </div>
    </div>
  );
};

export default CommentModal;
