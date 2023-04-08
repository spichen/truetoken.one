import { expect } from "chai";
import { ethers } from "hardhat";
import { TrueToken } from "../typechain-types";
import { BigNumber } from "ethers";

describe("TrueToken", function () {
  let trueToken: TrueToken;
  const businessMetadataUri = "https://truetoken.io/businessmeta/{id}.json";

  beforeEach(async () => {
    const trueTokenFactory = await ethers.getContractFactory("TrueToken");
    trueToken = (await trueTokenFactory.deploy(businessMetadataUri)) as TrueToken;
    await trueToken.deployed();
  });

  describe("Register Business", () => {
    it("Should register business", async function () {
      const [business] = await ethers.getSigners();

      const tx = await trueToken.registerBusiness(business.address, "Business Name");
      await tx.wait();

      expect(await trueToken.businessIdOfAccount(business.address)).to.equal("340282366920938463463374607431768211456");
    });
    it("Should emit event when registering business", async function () {
      const [business] = await ethers.getSigners();

      await expect(trueToken.registerBusiness(business.address, "Business Name"))
        .to.emit(trueToken, "BusinessRegistered")
        .withArgs(business.address, "340282366920938463463374607431768211456");
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

      const tx2 = await trueToken.connect(business).mint(wallet.address, "/asset/metadata");
      await tx2.wait();

      expect(await trueToken.balanceOf(wallet.address, "340282366920938463463374607431768211457")).to.equal(1);
      const tokens = await trueToken.tokenOwnedBy(wallet.address);
      expect(tokens[0][0]).to.equal(BigNumber.from("340282366920938463463374607431768211457"));
      expect(tokens[0][1]).to.equal(wallet.address);
      expect(tokens[0][2]).to.equal("ipfs:///asset/metadata");
      expect(await trueToken.businessIdOfToken("340282366920938463463374607431768211457")).to.equal(
        "340282366920938463463374607431768211456",
      );
    });
  });

  describe("Add History Entry", () => {
    it("Should reject if sender is not token issued business", async function () {
      await expect(trueToken.addHistoryEntry(7, "cid")).to.be.revertedWith("Only token owner can add history");
    });

    it("Should add history to token", async function () {
      const [business] = await ethers.getSigners();
      const wallet = ethers.Wallet.createRandom();

      await (await trueToken.connect(business).registerBusiness(business.address, "Business Name")).wait();
      await (await trueToken.connect(business).mint(wallet.address, "/asset/metadata")).wait();
      await (
        await trueToken.connect(business).addHistoryEntry("340282366920938463463374607431768211456", "log-hash")
      ).wait();

      expect((await trueToken.historyOf("340282366920938463463374607431768211456"))[0]).to.equal("log-hash");
    });
  });
});
