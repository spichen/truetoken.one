import { expect } from "chai";
import { ethers } from "hardhat";
import { TrueToken } from "../typechain-types";

describe("TrueToken", function () {
  let trueToken: TrueToken;
  const businessMetadataUri = "https://truetoken.io/businessmeta/{id}.json";

  beforeEach(async () => {
    const trueTokenFactory = await ethers.getContractFactory("TrueToken");
    trueToken = (await trueTokenFactory.deploy(businessMetadataUri)) as TrueToken;
    await trueToken.deployed();
  });

  describe("Deployment", () => {
    it("Should return uri provided during deployment", async function () {
      expect(await trueToken.uri(1)).to.equal(businessMetadataUri);
    });
  });

  describe("Register Business", () => {
    it("Should register business", async function () {
      const [business] = await ethers.getSigners();

      const tx = await trueToken.registerBusiness(business.address, "Business Name");
      await tx.wait();

      expect(await trueToken.businessIdOf(business.address)).to.equal(1);
    });
    it("Should emit event when registering business", async function () {
      const [business] = await ethers.getSigners();

      await expect(trueToken.registerBusiness(business.address, "Business Name"))
        .to.emit(trueToken, "BusinessRegistered")
        .withArgs(business.address, 1);
    });
  });

  describe("Mint Token", () => {
    it("Should reject if message is sent from non business address", async function () {
      const [nonRegisteredBusiness] = await ethers.getSigners();
      const wallet = ethers.Wallet.createRandom();
      await expect(trueToken.connect(nonRegisteredBusiness).mint(wallet.address, "23")).to.be.revertedWith(
        "Only registered business can mint token",
      );
    });

    it("Should mint token to customer", async function () {
      const [business] = await ethers.getSigners();
      const wallet = ethers.Wallet.createRandom();
      const tx = await trueToken.registerBusiness(business.address, "Business Name");
      await tx.wait();
      await expect(trueToken.connect(business).mint(wallet.address, "/asset/metadata"))
        .to.emit(trueToken, "TokenMint")
        .withArgs(wallet.address, 1);

      expect(await trueToken.balanceOf(wallet.address, 1)).to.equal(1);
      expect(await trueToken.tokenOf(wallet.address, 1)).to.equal(1);
      expect((await trueToken.logsOf(1))[0]).to.equal("/asset/metadata");
      expect(await trueToken.businessIdOfToken(1)).to.equal(1);
    });
  });

  describe("Add Log", () => {
    it("Should reject if sender is not token issued business", async function () {
      await expect(trueToken.addLog(1, "23")).to.be.revertedWith("Only token issued business can add log");
    });

    it("Should add log to token", async function () {
      const [business] = await ethers.getSigners();
      const wallet = ethers.Wallet.createRandom();

      await (await trueToken.registerBusiness(business.address, "Business Name")).wait();
      await trueToken.connect(business).mint(wallet.address, "/asset/metadata");

      await trueToken.addLog(1, "log-hash");

      expect((await trueToken.logsOf(1))[1]).to.equal("log-hash");
    });
  });
});
