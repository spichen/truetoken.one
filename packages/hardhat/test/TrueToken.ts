import { expect } from "chai";
import { ethers } from "hardhat";
import { TrueToken } from "../typechain-types";

describe("TrueToken", function () {
  let trueToken: TrueToken;
  const brandMetadataUri = "https://truetoken.io/brandmeta/{id}.json";

  beforeEach(async () => {
    const trueTokenFactory = await ethers.getContractFactory("TrueToken");
    trueToken = (await trueTokenFactory.deploy(brandMetadataUri)) as TrueToken;
    await trueToken.deployed();
  });

  describe("Deployment", () => {
    it("Should return uri provided during deployment", async function () {
      expect(await trueToken.uri(1)).to.equal(brandMetadataUri);
    });
  });

  describe("Register Brand", () => {
    it("Should register brand", async function () {
      const [brand] = await ethers.getSigners();

      await trueToken.registerBrand(brand.address);

      expect(await trueToken.addressOf(1)).to.equal(brand.address);
    });
    it("Should emit event when registering brand", async function () {
      const [brand] = await ethers.getSigners();

      await expect(trueToken.registerBrand(brand.address))
        .to.emit(trueToken, "BrandRegistered")
        .withArgs(brand.address, 1);
    });
  });

  describe("Mint Token", () => {
    it("Should reject if message is sent from non brand address", async function () {
      const wallet = ethers.Wallet.createRandom();
      await expect(trueToken.mint(wallet.address, 1, "23")).to.be.revertedWith("Only brand owner can mint token");
    });

    it("Should mint token to customer", async function () {
      const [brand] = await ethers.getSigners();
      await trueToken.registerBrand(brand.address);

      const wallet = ethers.Wallet.createRandom();
      await trueToken.mint(wallet.address, 1, "/asset/metadata");

      expect(await trueToken.balanceOf(wallet.address, 1)).to.equal(1);
      expect(await trueToken.tokenOf(wallet.address, 1)).to.equal(1);
      expect((await trueToken.logsOf(1))[0]).to.equal("/asset/metadata");
      expect(await trueToken.brandIdOf(1)).to.equal(1);
    });
  });

  describe("Add Log", () => {
    it("Should reject if sender is not token issued brand", async function () {
      await expect(trueToken.addLog(1, "23")).to.be.revertedWith("Only token issued brand can add log");
    });

    it("Should add log to token", async function () {
      const [brand] = await ethers.getSigners();
      await trueToken.registerBrand(brand.address);

      const wallet = ethers.Wallet.createRandom();
      await trueToken.mint(wallet.address, 1, "/asset/metadata");

      await trueToken.addLog(1, "log-hash");

      expect((await trueToken.logsOf(1))[1]).to.equal("log-hash");
    });
  });
});
