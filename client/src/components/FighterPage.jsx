import Navbar from "./Navbar";
import FighterPageContent from "./FighterPageContent";
import Footer from "./Footer";

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
