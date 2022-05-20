import Navbar from "../common/Navbar";
import MarketContent from "./MarketContent";
import Footer from "../common/Footer";

const Market = () => {
  return (
    <div className="min-h-screen gradient-bg-welcome font-medieval">
      <Navbar />
      <MarketContent />
      <Footer />
    </div>
  );
};

export default Market;
