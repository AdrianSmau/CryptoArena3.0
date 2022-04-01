import Navbar from "./Navbar";
import Welcome from "./Welcome";
import Transactions from "./Transactions";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <LatestFighters />
      <Footer />
    </div>
  );
};

export default Home;
