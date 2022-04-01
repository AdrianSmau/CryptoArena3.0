const main = async () => {
  const ArenaFactory = await hre.ethers.getContractFactory("Arena");
  const arena = await ArenaFactory.deploy();

  await arena.deployed();

  console.log("Arena deployed to:", arena.address);
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
