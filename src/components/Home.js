import FeedPost from "./FeedPost";
import Suggestion from "./Suggestion";

const Home = () => {
  return (
    <div className="flex justify-center  md:gap-20   ">
      {/* <div className="w-32 h-[100vh]"></div> */}
      <div className="max-w-[320px] sm:max-w-[400px] lg:max-w-[450px]  xl:max-w-[500px]  relative left-3 sm:left-10 lg:-left-12 xl:left-0  ">
        {" "}
        <FeedPost />
      </div>

      <div className="hidden lg:block  fixed right-1 ">
        <Suggestion />
      </div>
    </div>
  );
};

export default Home;
