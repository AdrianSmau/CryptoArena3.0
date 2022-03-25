import Navbar from "./Navbar";
import FighterCreation from "./FighterCreation";
import Footer from "./Footer";

const Barracks = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <FighterCreation />
      </div>
      <Footer />
    </div>
  );
  };
  
  export default Barracks;
  