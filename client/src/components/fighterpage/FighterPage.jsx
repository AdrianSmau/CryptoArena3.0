import Navbar from "../common/Navbar";
import FighterPageContent from "./FighterPageContent";
import Footer from "../common/Footer";

const FighterPage = () => {
  return (
    <div className="min-h-screen gradient-bg-welcome">
      <Navbar />
      <FighterPageContent />
      <Footer />
    </div>
  );
};

export default FighterPage;
