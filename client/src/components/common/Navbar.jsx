import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

import { BlockchainContext } from "../../context/Context";

import logo from "../../../images/logo.png";

const NavbarItem = ({ title, classProps }) => {
  return (
    <li className={`mx-4 cursor-pointer ${classProps}`}>
      <Link to={`/${title.toLowerCase()}`}>{title}</Link>
    </li>
  );
};

const Navbar = () => {
  const { connectWallet, currentAccount } = useContext(BlockchainContext);

  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <nav className="w-full font-medieval flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={logo} alt="logo" className="w-48 cursor-pointer" />
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {["Home", "Barracks", "Arena", "Archive", "Merchant"].map(
          (item, index) => (
            <NavbarItem key={item + index} title={item} />
          )
        )}
        {!currentAccount && (
          <button
            type="button"
            onClick={connectWallet}
            className="bg-[#8e0005] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#b20006]"
          >
            <p className="text-white text-base font-semibold">Connect</p>
          </button>
        )}
      </ul>
      <div className="flex relative">
        {toggleMenu ? (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <ul className="z-10 fixed top-0 -right-2 p-3 w-[42.5vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start items-end rounded-md red-glassmorphism text-white animate-slide-in">
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {["Home", "Barracks", "Arena", "Archive", "Merchant"].map(
              (item, index) => (
                <NavbarItem
                  key={item + index}
                  title={item}
                  classProps="my-2 text-lg"
                />
              )
            )}
            {!currentAccount && (
              <button
                type="button"
                onClick={connectWallet}
                className="bg-[#8e0005] py-2 px-5 mf:px-7 mx-2 mf:mx-4 rounded-full cursor-pointer hover:bg-[#b20006]"
              >
                <p className="text-white text-base font-semibold">Connect</p>
              </button>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
