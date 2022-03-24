const main = async () => {
  const FighterFactory = await hre.ethers.getContractFactory("FighterFactory");
  const fighter_factory = await FighterFactory.deploy();

  await fighter_factory.deployed();

  console.log("Fighter Factory deployed to:", fighter_factory.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
