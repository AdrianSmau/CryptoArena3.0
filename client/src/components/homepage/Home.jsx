import Navbar from "../common/Navbar";
import Welcome from "./Welcome";
import Footer from "../common/Footer";

const Home = () => {
  return (
    <div className="min-h-screen gradient-bg-welcome">
      <Navbar />
      <Welcome />
      <Footer />
    </div>
  );
};

export default Home;
