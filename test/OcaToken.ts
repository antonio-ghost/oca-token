import { expect } from "chai";
import { network } from "hardhat";

describe("OcaToken", function () {
  async function deployOcaTokenFixture() {
    const { ethers } = await network.create();

    const [owner, treasury, pair, user1, user2] = await ethers.getSigners();

    const OcaToken = await ethers.getContractFactory("OcaToken");
    const ocaToken = await OcaToken.deploy(treasury.address);

    await ocaToken.waitForDeployment();

    return { ethers, ocaToken, owner, treasury, pair, user1, user2 };
  }

  it("should deploy with the correct name, symbol, decimals and total supply", async function () {
    const { ethers, ocaToken, owner } = await deployOcaTokenFixture();

    const expectedSupply = ethers.parseUnits("100000000", 18);

    expect(await ocaToken.name()).to.equal("OCA Token");
    expect(await ocaToken.symbol()).to.equal("OCA");
    expect(await ocaToken.decimals()).to.equal(18);
    expect(await ocaToken.totalSupply()).to.equal(expectedSupply);
    expect(await ocaToken.balanceOf(owner.address)).to.equal(expectedSupply);
  });

  it("should not apply tax on normal wallet-to-wallet transfers", async function () {
    const { ethers, ocaToken, owner, treasury, user1, user2 } =
      await deployOcaTokenFixture();

    const amount = ethers.parseUnits("1000", 18);

    await ocaToken.connect(owner).transfer(user1.address, amount);
    await ocaToken.connect(user1).transfer(user2.address, amount);

    expect(await ocaToken.balanceOf(user2.address)).to.equal(amount);
    expect(await ocaToken.balanceOf(treasury.address)).to.equal(0);
  });

  it("should apply 0.5% burn and 0.5% treasury tax on buy", async function () {
    const { ethers, ocaToken, owner, treasury, pair, user1 } =
      await deployOcaTokenFixture();

    await ocaToken.connect(owner).setPancakePair(pair.address);

    const pairLiquidity = ethers.parseUnits("10000", 18);
    await ocaToken.connect(owner).transfer(pair.address, pairLiquidity);

    const buyAmount = ethers.parseUnits("1000", 18);

    const expectedBurn = ethers.parseUnits("5", 18);
    const expectedTreasury = ethers.parseUnits("5", 18);
    const expectedUserReceive = ethers.parseUnits("990", 18);

    const supplyBefore = await ocaToken.totalSupply();

    await ocaToken.connect(pair).transfer(user1.address, buyAmount);

    expect(await ocaToken.balanceOf(user1.address)).to.equal(expectedUserReceive);
    expect(await ocaToken.balanceOf(treasury.address)).to.equal(expectedTreasury);
    expect(await ocaToken.totalSupply()).to.equal(supplyBefore - expectedBurn);
  });

  it("should apply 0.5% burn and 0.5% treasury tax on sell", async function () {
    const { ethers, ocaToken, owner, treasury, pair, user1 } =
      await deployOcaTokenFixture();

    await ocaToken.connect(owner).setPancakePair(pair.address);

    const userAmount = ethers.parseUnits("1000", 18);
    await ocaToken.connect(owner).transfer(user1.address, userAmount);

    const sellAmount = ethers.parseUnits("100", 18);

    const expectedBurn = ethers.parseUnits("0.5", 18);
    const expectedTreasury = ethers.parseUnits("0.5", 18);
    const expectedPairReceive = ethers.parseUnits("99", 18);

    const supplyBefore = await ocaToken.totalSupply();

    await ocaToken.connect(user1).transfer(pair.address, sellAmount);

    expect(await ocaToken.balanceOf(pair.address)).to.equal(expectedPairReceive);
    expect(await ocaToken.balanceOf(treasury.address)).to.equal(expectedTreasury);
    expect(await ocaToken.totalSupply()).to.equal(supplyBefore - expectedBurn);
  });

  it("should allow owner to update treasury wallet", async function () {
    const { ocaToken, owner, user2 } = await deployOcaTokenFixture();

    await ocaToken.connect(owner).setTreasuryWallet(user2.address);

    expect(await ocaToken.treasuryWallet()).to.equal(user2.address);
    expect(await ocaToken.isExcludedFromTax(user2.address)).to.equal(true);
  });

  it("should prevent non-owner from changing treasury wallet", async function () {
    const { ethers, ocaToken, user1, user2 } = await deployOcaTokenFixture();

    await expect(
      ocaToken.connect(user1).setTreasuryWallet(user2.address)
    ).to.be.revert(ethers);
  });
});