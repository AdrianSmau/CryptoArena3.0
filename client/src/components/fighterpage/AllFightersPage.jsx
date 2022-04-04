import Navbar from "../common/Navbar";
import LatestFighters from "./AllFighters";
import Footer from "../common/Footer";

const AllFightersPage = () => {
  return (
    <div className="min-h-screen gradient-bg-welcome">
      <Navbar />
      <LatestFighters />
      <Footer />
    </div>
  );
};

export default AllFightersPage;
