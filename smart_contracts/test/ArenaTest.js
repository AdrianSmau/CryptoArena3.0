const { expect } = require("chai");
const { ethers } = require("hardhat");

let arena, addr1, addr2, addr3, addr4, allFighters;
beforeEach(async () => {
  [addr1, addr2, addr3, addr4] = await ethers.getSigners();
  const ArenaFactory = await ethers.getContractFactory("Arena");
  arena = await ArenaFactory.deploy();
  await arena.deployed();
});

describe("CryptoArena3.0", function () {
  it("Market flow", async function () {
    await arena.connect(addr1).createFirstFighter("addr1", 2);
    await arena.connect(addr2).createFirstFighter("addr2", 0);
    let tx = await arena.connect(addr1).putUpForSale(0, 1);
    let receipt = await tx.wait();
    console.log(receipt); 
  });

  xit("mint & tokenUri", async function () {
    await arena.connect(addr1).createFirstFighter("addr1", 2);

    await arena.connect(addr1)._mintFighter(0);

    const tokenUri = await arena.connect(addr1).tokenURI(0);
    console.log("Token URI is: ", tokenUri);
  });

  xit("Errors attack flow", async function () {
    await arena.connect(addr1).createFirstFighter("addr1", 2);
    await arena.connect(addr2).createFirstFighter("addr2", 2);
    await arena.connect(addr3).createFirstFighter("addr3", 2);
    await arena.connect(addr4).createFirstFighter("addr4", 2);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr4).attack(3, false, 0, 1);
    await arena.connect(addr3).attack(2, false, 0, 3);
    await arena.connect(addr2).attack(1, false, 0, 3);
    expect(arena.connect(addr3).attack(2, false, 0, 3)).to.be.revertedWith(
      "Your fighter is not yet ready to fight!"
    );
  });

  xit("Create a first Fighter correctly", async function () {
    await arena.createFirstFighter("Jack", 2);
    const myFighters = await arena._getLatestFighters(1);
    expect(myFighters[0].fighter.name).to.equal("Jack");
    expect(myFighters[0].fighter.class).to.equal(2);
    expect(myFighters[0].fighter.strength).to.equal(1);
    expect(myFighters[0].fighter.agility).to.equal(1);
    expect(myFighters[0].fighter.luck).to.equal(1);
    expect(myFighters[0].fighter.dexterity).to.equal(1);
    expect(myFighters[0].fighter.winCount).to.equal(0);
    expect(myFighters[0].fighter.lossCount).to.equal(0);
  });

  xit("Not create a first Fighter with invalid name", async function () {
    expect(arena.createFirstFighter("", 2)).to.be.revertedWith(
      "The name you inserted for your Fighter is invalid!"
    );
  });

  xit("Not create a first Fighter with invalid class", async function () {
    expect(arena.createFirstFighter("Jack", 4)).to.be.revertedWith(
      "The class you inserted for your Fighter is invalid!"
    );
  });

  xit("Not create a second Fighter after a first one has been created", async function () {
    await arena.createFirstFighter("John", 2);
    expect(arena.createFirstFighter("Jack", 1)).to.be.revertedWith(
      "You already have fighters in your Barracks! Enter the Arena and earn yourself more Fighters!"
    );
  });

  xit("Not attack while on cooldown", async function () {
    await arena.connect(addr1).createFirstFighter("John", 2);
    await arena.connect(addr2).createFirstFighter("Jack", 1);
    expect(arena.connect(addr1).attack(0, false, 0, 1)).to.be.revertedWith(
      "Your fighter is not yet ready to fight!"
    );
  });

  xit("Not attack with a fighter you do not own", async function () {
    await arena.connect(addr1).createFirstFighter("John", 2);
    await arena.connect(addr2).createFirstFighter("Jack", 1);
    await network.provider.send("evm_increaseTime", [86400]);
    expect(arena.connect(addr1).attack(1, false, 0, 0)).to.be.revertedWith(
      "You are not the owner of this Fighter!"
    );
  });

  xit("Arena Fight Flow #1", async function () {
    await arena.connect(addr1).createFirstFighter("John", 2);
    await arena.connect(addr2).createFirstFighter("Jack", 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    // John will win 6 times because he is a druid and they are unarmed. So, being early on in the game and having no weapons, the druid has an advantage!
    // => John should have 6 * 45 = 270 XP, level 3, with 300 XP for level 4, 2 spendable points
    // => Jack will have 6 * 20 = 120 X[, level 2, with 200 XP for level 3, 1 spendable points
    allFighters = await arena._getLatestFighters(0);
    expect(allFighters[1].fighter.winCount).to.equal(6);
    expect(allFighters[1].fighter.lossCount).to.equal(0);
    expect(allFighters[1].fighter.currentXP).to.equal(270);
    expect(allFighters[1].fighter.levelUpXP).to.equal(300);
    expect(allFighters[1].fighter.level).to.equal(3);
    expect(allFighters[1].fighter.spendablePoints).to.equal(2);

    expect(allFighters[0].fighter.winCount).to.equal(0);
    expect(allFighters[0].fighter.lossCount).to.equal(6);
    expect(allFighters[0].fighter.currentXP).to.equal(120);
    expect(allFighters[0].fighter.levelUpXP).to.equal(200);
    expect(allFighters[0].fighter.level).to.equal(2);
    expect(allFighters[0].fighter.spendablePoints).to.equal(1);
    // Let's make John spend his points and put one of them into luck!
    await arena.connect(addr1)._spendAvailablePoints(0, 0, 0, 1, 0);
    allFighters = await arena._getLatestFighters(0);
    expect(allFighters[1].fighter.luck).to.equal(2);
    expect(allFighters[1].fighter.spendablePoints).to.equal(1);
    // Let's check that another player cannot spend another fighter's points
    expect(
      arena.connect(addr2)._spendAvailablePoints(0, 0, 0, 1, 0)
    ).to.be.revertedWith("You are not the owner of this Fighter!");
    // Let's put the last available point into dexterity and verify that we cannot spend anymore points since we have 0
    await arena.connect(addr1)._spendAvailablePoints(0, 0, 0, 0, 1);
    allFighters = await arena._getLatestFighters(0);
    expect(allFighters[1].fighter.dexterity).to.equal(2);
    expect(allFighters[1].fighter.spendablePoints).to.equal(0);
    expect(
      arena.connect(addr2)._spendAvailablePoints(0, 0, 0, 0, 1)
    ).to.be.revertedWith(
      "You do not have enough available spendable points in order to do this action!"
    );
  });

  xit("Buy a Weapon correctly", async function () {
    await arena.connect(addr1)._purchaseWeapon(3, 0, 0, {
      value: ethers.utils.parseEther("1.0"),
    }); // S-tier weapon, level 3 => must have 12 damage and 8 skillReq
    const myWeapons = await arena.connect(addr1)._getUserWeapons(addr1.address);
    expect(myWeapons[0].weapon.damage).to.equal(12);
    expect(myWeapons[0].weapon.levelReq).to.equal(3);
    expect(myWeapons[0].weapon.skillReq).to.equal(8);
    expect(myWeapons[0].weapon.weapType).to.equal(0);
    expect(myWeapons[0].weapon.tier).to.equal(0);
  });

  xit("Not create a Weapon with invalid level", async function () {
    expect(arena._purchaseWeapon(0, 0, 1), {
      value: ethers.utils.parseEther("1.0"),
    }).to.be.revertedWith("The level you inserted for your Weapon is invalid!");
  });

  xit("Not create a Weapon with invalid type", async function () {
    expect(arena._purchaseWeapon(10, 2, 1), {
      value: ethers.utils.parseEther("1.0"),
    }).to.be.revertedWith("The type you inserted for your Weapon is invalid!");
  });

  xit("Not create a Weapon with invalid tier", async function () {
    expect(arena._purchaseWeapon(10, 1, 3), {
      value: ethers.utils.parseEther("1.0"),
    }).to.be.revertedWith("The tier you inserted for your Weapon is invalid!");
  });

  xit("Not create a Weapon when sending insufficient ETH but should when sending correct amount", async function () {
    // Price will be 0.00075 * 10 + 0.003 = 0.0105
    expect(arena._purchaseWeapon(10, 1, 0), {
      value: ethers.utils.parseEther("0.0104"),
    }).to.be.revertedWith("You sent insufficient ETH for forging this weapon!");

    await arena._purchaseWeapon(10, 1, 0, {
      value: ethers.utils.parseEther("0.0105"),
    }); // S-tier weapon, level 10 => must have 40 damage and 8 skillReq
    const myWeapons = await arena.connect(addr1)._getUserWeapons(addr1.address);
    expect(myWeapons[0].weapon.damage).to.equal(40);
    expect(myWeapons[0].weapon.levelReq).to.equal(10);
    expect(myWeapons[0].weapon.skillReq).to.equal(8);
    expect(myWeapons[0].weapon.weapType).to.equal(1);
    expect(myWeapons[0].weapon.tier).to.equal(0);
  });

  xit("Arena Fight Flow #2", async function () {
    await arena.connect(addr1).createFirstFighter("John", 2);
    await arena.connect(addr2).createFirstFighter("Jack", 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    await network.provider.send("evm_increaseTime", [86400]);

    // Now, John will win 22 times. John will be level 10 and Jack will be level 5.
    // Let's try to purchase a weapon for Jack. Since he is a Samurai, we will buy a S tier, level 5 Slash weapon.
    await arena.connect(addr2)._purchaseWeapon(5, 0, 0, {
      value: ethers.utils.parseEther("0.00675"),
    });

    // Let's attack with Jack now!
    var jackWeapons = await arena.connect(addr2)._getUserWeapons(addr2.address);
    expect(
      arena.connect(addr2).attack(1, true, jackWeapons[0].id, 0)
    ).to.be.revertedWith(
      "You cannot use this weapon, your agility skill is insufficient!"
    );

    // Let's level Jack up to lvl 6 in order to have 5 spendable points

    // Our attack failed! That is because our agility level is insufficient for us to use a S tier weapon!
    // Let's buy a A tier one and use it!
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr1).attack(0, false, 0, 1);
    await network.provider.send("evm_increaseTime", [86400]);
    await arena.connect(addr2).attack(1, false, 0, 0);
    await network.provider.send("evm_increaseTime", [86400]);

    // Let's spend our points and put all of them into agility in order to be able to use the weapon!
    await arena.connect(addr2)._spendAvailablePoints(1, 0, 5, 0, 0);

    await arena.connect(addr2)._purchaseWeapon(6, 0, 1, {
      value: ethers.utils.parseEther("0.00525"),
    });

    allFighters = await arena._getLatestFighters(0);

    expect(allFighters[0].fighter.agility).to.equal(6);
    expect(allFighters[0].fighter.spendablePoints).to.equal(0);

    jackWeapons = await arena.connect(addr2)._getUserWeapons(addr2.address);
    // Let's attack now
    await arena.connect(addr2).attack(1, true, jackWeapons[1].id, 0);

    allFighters = await arena._getLatestFighters(0);
    expect(allFighters[1].fighter.winCount).to.equal(25);
    expect(allFighters[1].fighter.lossCount).to.equal(1);
    expect(allFighters[0].fighter.winCount).to.equal(1);
    expect(allFighters[0].fighter.lossCount).to.equal(25);
    // Jack won! Now let's attack Jack back. The algorithm should be able to make him
    // use his own weapon to defend himself and earn himself the second win!
    await arena.connect(addr1).attack(0, false, 0, 1);

    allFighters = await arena._getLatestFighters(0);
    expect(allFighters[1].fighter.winCount).to.equal(25);
    expect(allFighters[1].fighter.lossCount).to.equal(2);
    expect(allFighters[0].fighter.winCount).to.equal(2);
    expect(allFighters[0].fighter.lossCount).to.equal(25);

    //Now, let's test the pupils feature! Since John is level 10+, addr1 has one pupil to redeem!
    expect(
      arena.connect(addr2).redeemAvailablePupil("Bob", 0)
    ).to.be.revertedWith(
      "You do not have any available pupils! Fight to earn more!"
    );
    expect(
      arena.connect(addr1).redeemAvailablePupil("John", 0)
    ).to.be.revertedWith(
      "The name you inserted for your Fighter is already used!"
    );
    await arena.connect(addr1).redeemAvailablePupil("Bob", 0);
    allFighters = await arena._getLatestFighters(0);
    expect(allFighters[0].fighter.name).to.equal("Bob");
    expect(allFighters[0].fighter.class).to.equal(0);
    expect(allFighters[0].fighter.strength).to.equal(1);
    expect(allFighters[0].fighter.agility).to.equal(1);
    expect(allFighters[0].fighter.luck).to.equal(1);
    expect(allFighters[0].fighter.dexterity).to.equal(1);
    expect(allFighters[0].fighter.winCount).to.equal(0);
    expect(allFighters[0].fighter.lossCount).to.equal(0);
    expect(arena.connect(addr1).attack(1, false, 0, 2)).to.be.revertedWith(
      "You cannot attack your own Fighter!"
    );
  });
});
