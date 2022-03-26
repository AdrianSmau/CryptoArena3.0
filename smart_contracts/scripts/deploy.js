const main = async () => {
  const FighterFactory = await hre.ethers.getContractFactory("FighterFactory");
  const fighter_factory = await FighterFactory.deploy();

  const WeaponFactory = await hre.ethers.getContractFactory("WeaponFactory");
  const weapon_factory = await WeaponFactory.deploy();

  await fighter_factory.deployed();
  await weapon_factory.deployed();

  console.log("Fighter Factory deployed to:", fighter_factory.address);
  console.log("Weapon Factory deployed to:", weapon_factory.address);
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
