import ethCoin from "../../../images/ethCoin.gif";

const LoadingMintingModal = () => {
  return (
    <div className="bg-neutral-800 bg-opacity-80 fixed inset-0 z-50">
      <div className="flex h-screen justify-center items-center">
        <div className="flex flex-col justify-center items-center bg-black p-2 md:p-4 border-4 border-red-900 rounded-xl">
          <p className="text-white md:text-xl text-2xl text-center text-gradient">
            Creating and minting Fighter!...
          </p>
          <img
            src={ethCoin}
            alt="ethCoin"
            className="p-2 md:p-4 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingMintingModal;
