import React, { useContext } from "react";

import Loader from "../common/Loader";

import warrior from "../../../images/warrior256.png";
import samurai from "../../../images/samurai256.png";
import druid from "../../../images/druid256.png";

import b_tier_slash from "../../../images/BTierSlash.png";
import a_tier_slash from "../../../images/ATierSlash.png";
import s_tier_slash from "../../../images/STierSlash.png";
import b_tier_blunt from "../../../images/BTierBlunt.png";
import a_tier_blunt from "../../../images/ATierBlunt.png";
import s_tier_blunt from "../../../images/STierBlunt.png";

import { BlockchainContext } from "../../context/Context";
import { shorten_address } from "../../utils/shorten_address";

const Welcome = () => {
  const { currentAccount, isContextLoading } = useContext(BlockchainContext);
  return (
    <>
      {isContextLoading ? (
        <Loader />
      ) : (
        <div className="flex w-full justify-center items-center font-medieval">
          {/*Toata pagina*/}
          <div className="flex flex-col items-center justify-between md:p-20 py-12 px-4">
            {/*Continutul efectiv al paginii, paddat si divizat in flex components*/}
            <div className="flex flex-1 justify-start text-center flex-col">
              {/*Prima sectiune - titlu, subtitlu, *currentAccount si !!!slideshow!!!*/}
              <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                Welcome to the Arena! <br /> It's time to earn your glory!
              </h1>
              <p className="mt-5 text-white font-light text-base">
                Enter the battle and be the best! Challenge new foes, recruit
                new troops, level up your fighters and earn new weapons! Web3
                has never been so fun!
              </p>
              <a
                href="https://docs.google.com/document/d/1o2lZrxTpVWmqFRAncoI1pS1lawIQrM_BZZPeUKItq8I/view"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="mt-5 text-white font-light text-base">
                  Consult CryptoArena3.0's project documentation here!
                </p>
              </a>
              {currentAccount && (
                <p className="mt-5 text-white font-light text-base">
                  ⚔️Greetings, {shorten_address(currentAccount)}!⚔️
                </p>
              )}
              {/*In loc de grid, ceva pentru prima sectiune, un slideshow ceva*/}
            </div>

            <div className="h-[1px] w-full bg-gray-400 mt-10" />
            {/*Delimitator*/}

            <div className="flex flex-col flex-1 items-center justify-start w-full mt-10">
              <h2 className="text-xl sm:text-3xl text-white text-gradient py-1">
                Choose your class!
              </h2>
              {/*A doua sectiune - prezentare clase*/}
              <div className="flex flex-col w-full text-center md:text-left flex md:justify-center justify-between md:items-start items-center p-4">
                <div className="flex md:flex-row flex-col justify-center items-center">
                  <div className="flex-[0.5] flex-initial justify-center items-center">
                    <img
                      src={warrior}
                      alt="warrior"
                      className="object-scale-down w-48"
                    />
                  </div>
                  <p className="text-white font-light md:w-8/12 w-11/12 md:pl-4 text-base">
                    Fearless and effective in battle, the Warrior enters the
                    Arena! The Warrior class deals bonus damage with Blunt-type
                    weapons!
                  </p>
                </div>
                <div className="flex md:flex-row flex-col justify-center items-center pt-6">
                  <div className="flex-[0.5] flex-initial justify-center items-center">
                    <img
                      src={samurai}
                      alt="samurai"
                      className="object-scale-down w-48"
                    />
                  </div>
                  <p className="text-white font-light md:w-8/12 w-11/12 md:pl-4 text-base">
                    Disciplined and tactical in battle, the Samurai enters the
                    Arena! The Samurai class deals bonus damage with Slash-type
                    weapons!
                  </p>
                </div>
                <div className="flex md:flex-row flex-col justify-center items-center pt-6">
                  <div className="flex-[0.5] flex-initial justify-center items-center">
                    <img
                      src={druid}
                      alt="druid"
                      className="object-scale-down w-48"
                    />
                  </div>
                  <p className="text-white font-light md:w-8/12 w-11/12 md:pl-4 text-base">
                    Calling upon the elements of nature, the Druid enters the
                    Arena! The Druid class has improved defense, being able to
                    take more damage in fights!
                  </p>
                </div>
              </div>
            </div>
            <div className="h-[1px] w-full bg-gray-400 mt-10" />
            {/*Delimitator*/}

            <div className="flex flex-col flex-1 items-center justify-start w-full mt-10">
              <h2 className="text-xl sm:text-3xl text-white text-gradient py-1">
                Earn or purchase unique weapons!
              </h2>
              {/*A doua sectiune - prezentare clase*/}
              <div className="flex flex-col w-full text-center md:text-left flex md:justify-center justify-between md:items-start items-center p-4">
                <div className="flex md:flex-row flex-col justify-center items-center">
                  <div className="flex-[0.5] flex-initial justify-center items-center">
                    <img
                      src={s_tier_slash}
                      alt="s_tier_slash"
                      className="object-scale-down w-48"
                    />
                  </div>
                  <p className="text-white font-light md:w-8/12 w-11/12 md:pl-4 text-base">
                    The S-tier Slash weapon has a requirement of AGL 8 and the
                    damage greatly scales with the level!
                  </p>
                </div>
                <div className="flex md:flex-row flex-col justify-center items-center pt-6">
                  <div className="flex-[0.5] flex-initial justify-center items-center">
                    <img
                      src={s_tier_blunt}
                      alt="s_tier_blunt"
                      className="object-scale-down w-48"
                    />
                  </div>
                  <p className="text-white font-light md:w-8/12 w-11/12 md:pl-4 text-base">
                    The S-tier Blunt weapon has a requirement of STR 8 and the
                    damage greatly scales with the level!
                  </p>
                </div>
                <div className="flex md:flex-row flex-col justify-center items-center pt-6">
                  <div className="flex-[0.5] flex-initial justify-center items-center">
                    <img
                      src={a_tier_slash}
                      alt="a_tier_slash"
                      className="object-scale-down w-48"
                    />
                  </div>
                  <p className="text-white font-light md:w-8/12 w-11/12 md:pl-4 text-base">
                    The A-tier Slash weapon has a requirement of AGL 6 and the
                    damage moderately scales with the level!
                  </p>
                </div>
                <div className="flex md:flex-row flex-col justify-center items-center pt-6">
                  <div className="flex-[0.5] flex-initial justify-center items-center">
                    <img
                      src={a_tier_blunt}
                      alt="a_tier_blunt"
                      className="object-scale-down w-48"
                    />
                  </div>
                  <p className="text-white font-light md:w-8/12 w-11/12 md:pl-4 text-base">
                    The A-tier Blunt weapon has a requirement of STR 6 and the
                    damage moderately scales with the level!
                  </p>
                </div>
                <div className="flex md:flex-row flex-col justify-center items-center pt-6">
                  <div className="flex-[0.5] flex-initial justify-center items-center">
                    <img
                      src={b_tier_slash}
                      alt="b_tier_slash"
                      className="object-scale-down w-48"
                    />
                  </div>
                  <p className="text-white font-light md:w-8/12 w-11/12 md:pl-4 text-base">
                    The B-tier Slash weapon has a requirement of AGL 3 and the
                    damage poorly scales with the level!
                  </p>
                </div>
                <div className="flex md:flex-row flex-col justify-center items-center pt-6">
                  <div className="flex-[0.5] flex-initial justify-center items-center">
                    <img
                      src={b_tier_blunt}
                      alt="a_tier_slash"
                      className="object-scale-down w-48"
                    />
                  </div>
                  <p className="text-white font-light md:w-8/12 w-11/12 md:pl-4 text-base">
                    The B-tier Blunt weapon has a requirement of STR 3 and the
                    damage poorly scales with the level!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Welcome;
