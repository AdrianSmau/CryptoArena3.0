const { expect } = require("chai");
const { ethers } = require("hardhat");

let weapon_factory;
beforeEach(async () => {
  const WeaponFactory = await ethers.getContractFactory("WeaponFactory");
  weapon_factory = await WeaponFactory.deploy();
  await weapon_factory.deployed();
});

describe("WeaponFactory", function () {
  it("Create a (first) Weapon correctly", async function () {
    await weapon_factory._forgeWeapon(3, 0, 0); // S-tier weapon, level 3 => must have 12 damage and 8 skillReq
    const myWeapons = await weapon_factory._getMyWeapons();
    expect(myWeapons[0].damage).to.equal(12);
    expect(myWeapons[0].levelReq).to.equal(3);
    expect(myWeapons[0].skillReq).to.equal(8);
    expect(myWeapons[0].weapType).to.equal(0);
    expect(myWeapons[0].tier).to.equal(0);
  });

  it("Not create a Weapon with invalid level", async function () {
    expect(weapon_factory._forgeWeapon(0, 0, 1)).to.be.revertedWith(
      "The level you inserted for your Weapon is invalid!"
    );
  });

  it("Not create a Weapon with invalid type", async function () {
    expect(weapon_factory._forgeWeapon(10, 2, 1)).to.be.revertedWith(
      "The type you inserted for your Weapon is invalid!"
    );
  });

  it("Not create a Weapon with invalid tier", async function () {
    expect(weapon_factory._forgeWeapon(10, 1, 3)).to.be.revertedWith(
      "The tier you inserted for your Weapon is invalid!"
    );
  });
});
