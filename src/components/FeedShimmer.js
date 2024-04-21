import React from "react";

const FeedShimmer = () => {
  //   return <div>sorry no posts found</div>;
  console.log("shimmer rendered");

  return (
    <>
      <div className="space-y-4">
        <div className="w-96 h-72  bg-slate-800 animate-pulse"></div>
        <div className="w-20 h-6 bg-slate-800 animate-pulse"></div>
        <div className="w-20 h-6 bg-slate-800 animate-pulse"></div>
        <div className="w-96 h-6 bg-slate-800 animate-pulse"></div>
      </div>
      <div className="space-y-4">
        <div className="w-96 h-72  bg-slate-800 animate-pulse"></div>
        <div className="w-20 h-6 bg-slate-800 animate-pulse"></div>
        <div className="w-20 h-6 bg-slate-800 animate-pulse"></div>
        <div className="w-96 h-6 bg-slate-800 animate-pulse"></div>
      </div>
      <div className="space-y-4">
        <div className="w-96 h-72  bg-slate-800 animate-pulse"></div>
        <div className="w-20 h-6 bg-slate-800 animate-pulse"></div>
        <div className="w-20 h-6 bg-slate-800 animate-pulse"></div>
        <div className="w-96 h-6 bg-slate-800 animate-pulse"></div>
      </div>
    </>
  );
};

export default FeedShimmer;
