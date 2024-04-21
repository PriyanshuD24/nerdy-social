import React from "react";

const ProfileShimmer = (props) => {
  return (
    <>
      <div className="text-center relative top-6 uppercase">
        {props?.numberOfPosts > 0 ? "Looking for posts...." : "NO POST AVAILABLE..."}
      </div>

      <div className="flex  flex-wrap gap-4 items-center justify-center mt-12 ">
        <div className="w-[250px] h-[250px] bg-slate-800 animate-pulse "></div>
        <div className="w-[250px] h-[250px] bg-slate-800 animate-pulse "></div>
        <div className="w-[250px] h-[250px] bg-slate-800 animate-pulse "></div>
        <div className="w-[250px] h-[250px] bg-slate-800 animate-pulse "></div>
        <div className="w-[250px] h-[250px] bg-slate-800 animate-pulse "></div>
        <div className="w-[250px] h-[250px] bg-slate-800 animate-pulse "></div>
      </div>
    </>
  );
};

export default ProfileShimmer;
