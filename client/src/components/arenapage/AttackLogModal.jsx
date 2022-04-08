import React, { useContext } from "react";

import { BlockchainContext } from "../../context/Context";

const AttackModal = () => {
  const { attackStats, setDisplayAttackLogs, youWon } =
    useContext(BlockchainContext);

  const handleProceedButton = (e) => {
    e.preventDefault();
    setDisplayAttackLogs(false);
    window.location.replace("http://localhost:3000/barracks");
  };

  const dodgedHits = attackStats.filter((result) => result === 0).length;
  const dodgedTargetHits = attackStats.filter((result) => result === 1).length;
  const criticalHitsDealt = attackStats.filter((result) => result === 2).length;
  const criticalHitsTaken = attackStats.filter((result) => result === 3).length;
  const hitsDealt = attackStats.filter((result) => result === 4).length;
  const hitsTaken = attackStats.filter((result) => result === 5).length;

  return (
    <div className="bg-neutral-800 bg-opacity-80 fixed inset-0 z-50">
      <div className="flex h-screen justify-center items-center">
        <div className="flex flex-col justify-center items-center bg-black p-2 md:p-4 border-4 border-red-900 rounded-xl">
          <p className="text-white md:text-xl text-2xl pb-2 md:pb-4 text-center text-gradient">
            {youWon
              ? "Congratulations! You won! Here are the stats of the fight:"
              : "You were defeated! Here are the stats of the fight:"}
          </p>
          <div className="flex flex-col pb-1 md:pb-2">
            <p className="text-white text-center sm:text-sm text-xs py-2 md:py-3">
              Your fighter hit ({hitsDealt}) normal hits to the target!
            </p>
            <p className="text-white text-center sm:text-sm text-xs py-2 md:py-3">
              Your fighter got hit by ({hitsTaken}) normal hits dealt by the
              target!
            </p>
            <p className="text-white text-center sm:text-sm text-xs py-2 md:py-3">
              Your fighter hit ({criticalHitsDealt}) critical hits to the
              target!
            </p>
            <p className="text-white text-center sm:text-sm text-xs py-2 md:py-3">
              Your fighter got hit by ({criticalHitsTaken}) critical hits dealt
              by the target!
            </p>
            <p className="text-white text-center sm:text-sm text-xs py-2 md:py-3">
              Your fighter managed to dodge ({dodgedHits}) hits dealt by the
              target!
            </p>
            <p className="text-white text-center sm:text-sm text-xs py-2 md:py-3">
              Target fighter managed to dodge ({dodgedTargetHits}) hits dealt by
              your fighter!
            </p>
          </div>
          <button
            type="button"
            onClick={handleProceedButton}
            className="bg-[#8e0005] py-2 px-5 mf:px-7 mx-2 mt-3 mf:mx-4 mf:mt-6 rounded-full cursor-pointer hover:bg-[#b20006]"
          >
            <p className="text-white text-base font-semibold">Proceed</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttackModal;
