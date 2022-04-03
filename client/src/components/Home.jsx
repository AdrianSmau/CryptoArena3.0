import Navbar from "./Navbar";
import Welcome from "./Welcome";
import LatestFighters from "./LatestFighters";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <LatestFighters />
      <div className="gradient-bg-footer">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
