const { expect } = require("chai");
const { ethers } = require("hardhat");

let arena;
beforeEach(async () => {
  const ArenaFactory = await ethers.getContractFactory("Arena");
  arena = await ArenaFactory.deploy();
  await arena.deployed();
});

describe("Arena", function () {
  it("Create a first Fighter correctly", async function () {
    await arena._createFirstFighter("Jack", 2);
    const myFighters = await arena._getMyFighters();
    expect(myFighters[0].fighter.name).to.equal("Jack");
    expect(myFighters[0].fighter.class).to.equal(2);
  });

  it("Not create a first Fighter with invalid name", async function () {
    expect(arena._createFirstFighter("", 2)).to.be.revertedWith(
      "The name you inserted for your Fighter is invalid!"
    );
  });

  it("Not create a first Fighter with invalid class", async function () {
    expect(arena._createFirstFighter("Jack", 4)).to.be.revertedWith(
      "The class you inserted for your Fighter is invalid!"
    );
  });

  it("Not create a second Fighter after a first one has been created", async function () {
    await arena._createFirstFighter("John", 2);
    expect(arena._createFirstFighter("Jack", 1)).to.be.revertedWith(
      "You already have fighters in your Barracks! Enter the Arena and earn yourself more Fighters!"
    );
  });
});
