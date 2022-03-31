const { expect } = require("chai");
const { ethers } = require("hardhat");

let merchant;
beforeEach(async () => {
  const MerchantFactory = await ethers.getContractFactory("Merchant");
  merchant = await MerchantFactory.deploy();
  await merchant.deployed();
});

describe("Merchant", function () {
  it("Buy a Weapon correctly", async function () {
    await merchant._purchaseWeapon(3, 0, 0, {
      value: ethers.utils.parseEther("1.0"),
    }); // S-tier weapon, level 3 => must have 12 damage and 8 skillReq
    const myWeapons = await merchant._getMyWeapons();
    expect(myWeapons[0].damage).to.equal(12);
    expect(myWeapons[0].levelReq).to.equal(3);
    expect(myWeapons[0].skillReq).to.equal(8);
    expect(myWeapons[0].weapType).to.equal(0);
    expect(myWeapons[0].tier).to.equal(0);
  });

  it("Not create a Weapon with invalid level", async function () {
    expect(merchant._purchaseWeapon(0, 0, 1), {
      value: ethers.utils.parseEther("1.0"),
    }).to.be.revertedWith("The level you inserted for your Weapon is invalid!");
  });

  it("Not create a Weapon with invalid type", async function () {
    expect(merchant._purchaseWeapon(10, 2, 1), {
      value: ethers.utils.parseEther("1.0"),
    }).to.be.revertedWith("The type you inserted for your Weapon is invalid!");
  });

  it("Not create a Weapon with invalid tier", async function () {
    expect(merchant._purchaseWeapon(10, 1, 3), {
      value: ethers.utils.parseEther("1.0"),
    }).to.be.revertedWith("The tier you inserted for your Weapon is invalid!");
  });

  it("Not create a Weapon when sending insufficient ETH but should when sending correct amount", async function () {
    // Price will be 0.00075 * 10 + 0.003 = 0.0105
    expect(merchant._purchaseWeapon(10, 1, 0), {
      value: ethers.utils.parseEther("0.0104"),
    }).to.be.revertedWith("You sent insufficient ETH for forging this weapon!");

    await merchant._purchaseWeapon(10, 1, 0, {
      value: ethers.utils.parseEther("0.0105"),
    }); // S-tier weapon, level 10 => must have 40 damage and 8 skillReq
    const myWeapons = await merchant._getMyWeapons();
    expect(myWeapons[0].damage).to.equal(40);
    expect(myWeapons[0].levelReq).to.equal(10);
    expect(myWeapons[0].skillReq).to.equal(8);
    expect(myWeapons[0].weapType).to.equal(1);
    expect(myWeapons[0].tier).to.equal(0);
  });
});
