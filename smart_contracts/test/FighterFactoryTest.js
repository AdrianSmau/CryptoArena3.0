const { expect } = require("chai");
const { ethers } = require("hardhat");

let fighter_factory;
beforeEach(async () => {
  const FighterFactory = await ethers.getContractFactory("FighterFactory");
  fighter_factory = await FighterFactory.deploy();
  await fighter_factory.deployed();
});

describe("FighterFactory", function () {
  it("Create a first Fighter correctly", async function () {
    await fighter_factory._createFighter("John", 2);
    const myFighters = await fighter_factory._getMyFighters();
    expect(myFighters[0].name).to.equal("John");
    expect(myFighters[0].class).to.equal(2);
  });

  it("Not create a first Fighter with invalid name", async function () {
    expect(fighter_factory._createFighter("", 2)).to.be.revertedWith(
      "The name you inserted for your Fighter is invalid!"
    );
  });

  it("Not create a first Fighter with invalid class", async function () {
    expect(fighter_factory._createFighter("John", 4)).to.be.revertedWith(
      "The class you inserted for your Fighter is invalid!"
    );
  });

  it("Not create a second Fighter after a first one has been created", async function () {
    await fighter_factory._createFighter("John", 2);
    expect(fighter_factory._createFighter("Jack", 1)).to.be.revertedWith(
      "You already have fighters in your Barracks! Enter the Arena and earn yourself more Fighters!"
    );
  });
});
