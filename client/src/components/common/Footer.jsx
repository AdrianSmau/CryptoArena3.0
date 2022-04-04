import logo from "../../../images/logo.png";

const Footer = () => {
  return (
    <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 font-medieval">
      <div className="w-full flex sm:flex-row flex-col justify-between items-center mt-4 mb-2">
        <div className="flex flex-[0.5] justify-center items-center">
          <img src={logo} alt="logo" className="w-32" />
        </div>
        <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-4 w-full">
          <a
            href="https://github.com/AdrianSmau"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-white text-base text-center mx-2 cursor-pointer">
              GitHub
            </p>
          </a>
          <a
            href="https://www.linkedin.com/in/smauadrianconstantin/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-white text-base text-center mx-2 cursor-pointer">
              LinkedIn
            </p>
          </a>
          <a
            href="https://profs.info.uaic.ro/~arusoaie.andrei/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-white text-base text-center mx-2 cursor-pointer">
              Coordinator
            </p>
          </a>
          <a
            href="https://www.info.uaic.ro/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-white text-base text-center mx-2 cursor-pointer">
              Faculty
            </p>
          </a>
        </div>
      </div>
      <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-2" />

      <div className="sm:w-[90%] w-full flex justify-between items-center mt-2">
        <p className="text-white text-left text-xs">Smău Adrian-Constantin, lucrare de licenţă 2022</p>
        <p className="text-white text-right text-xs">Prof. coord. Arusoaie Andrei</p>
      </div>
    </div>
  );
};

export default Footer;
