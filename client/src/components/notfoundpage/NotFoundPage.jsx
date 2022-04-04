import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

import notFound from "../../../images/404.png";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen gradient-bg-welcome">
      <Navbar />
      <div className="flex w-full justify-center items-center md:p-8 py-12 px-2 2xl:px-14 font-medieval">
        <div className="flex flex-col justify-between items-center">
          <h2 className="text-white text-3xl text-center my-2 text-gradient">
            Oops! This resource/page does not exist!
          </h2>
          <img
            src={notFound}
            alt="404"
            className="object-scale-down w-80 md:mt-10 mt-5 text-center white-glassmorphism"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
