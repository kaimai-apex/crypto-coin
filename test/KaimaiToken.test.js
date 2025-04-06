const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KaimaiToken", function () {
  let KaimaiToken;
  let token;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    KaimaiToken = await ethers.getContractFactory("KaimaiToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new KaimaiToken contract before each test
    token = await KaimaiToken.deploy();
    await token.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the correct initial supply", async function () {
      expect(await token.INITIAL_SUPPLY()).to.equal(ethers.utils.parseEther("1000000")); // 1 million tokens
    });

    it("Should set the correct maximum supply", async function () {
      expect(await token.MAX_SUPPLY()).to.equal(ethers.utils.parseEther("10000000")); // 10 million tokens
    });

    it("Should have the correct name and symbol", async function () {
      expect(await token.name()).to.equal("Kaimai Token");
      expect(await token.symbol()).to.equal("KAIMAI");
    });

    it("Should have 18 decimals", async function () {
      expect(await token.decimals()).to.equal(18);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await token.transfer(addr1.address, 50);
      expect(await token.balanceOf(addr1.address)).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await token.connect(addr1).transfer(addr2.address, 50);
      expect(await token.balanceOf(addr2.address)).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      expect(await token.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1
      await token.transfer(addr1.address, 100);
      expect(await token.balanceOf(addr1.address)).to.equal(100);

      // Transfer 50 tokens from addr1 to addr2
      await token.connect(addr1).transfer(addr2.address, 50);
      expect(await token.balanceOf(addr2.address)).to.equal(50);
      expect(await token.balanceOf(addr1.address)).to.equal(50);
      expect(await token.balanceOf(owner.address)).to.equal(
        initialOwnerBalance.sub(100)
      );
    });

    it("Should emit Transfer events", async function () {
      const amount = 100;
      await expect(token.transfer(addr1.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, addr1.address, amount);
    });

    it("Should handle zero amount transfers", async function () {
      await token.transfer(addr1.address, 0);
      expect(await token.balanceOf(addr1.address)).to.equal(0);
    });

    it("Should handle transfer to self", async function () {
      const initialBalance = await token.balanceOf(owner.address);
      await token.transfer(owner.address, 100);
      expect(await token.balanceOf(owner.address)).to.equal(initialBalance);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      await token.mint(addr1.address, mintAmount);
      expect(await token.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should fail if non-owner tries to mint", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      await expect(
        token.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should fail if minting would exceed max supply", async function () {
      const maxSupply = await token.MAX_SUPPLY();
      const currentSupply = await token.totalSupply();
      const excessAmount = maxSupply.sub(currentSupply).add(1);
      
      await expect(
        token.mint(addr1.address, excessAmount)
      ).to.be.revertedWith("Exceeds maximum supply");
    });

    it("Should emit TokensMinted event", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      await expect(token.mint(addr1.address, mintAmount))
        .to.emit(token, "TokensMinted")
        .withArgs(addr1.address, mintAmount);
    });

    it("Should handle minting zero tokens", async function () {
      await token.mint(addr1.address, 0);
      expect(await token.balanceOf(addr1.address)).to.equal(0);
    });

    it("Should track total minted correctly", async function () {
      const mintAmount1 = ethers.utils.parseEther("1000");
      const mintAmount2 = ethers.utils.parseEther("2000");
      
      await token.mint(addr1.address, mintAmount1);
      await token.mint(addr2.address, mintAmount2);
      
      const expectedTotal = (await token.INITIAL_SUPPLY()).add(mintAmount1).add(mintAmount2);
      expect(await token.totalSupply()).to.equal(expectedTotal);
    });
  });

  describe("Burning", function () {
    it("Should allow users to burn their own tokens", async function () {
      // First transfer some tokens to addr1
      const transferAmount = ethers.utils.parseEther("1000");
      await token.transfer(addr1.address, transferAmount);
      
      // Then burn some tokens
      const burnAmount = ethers.utils.parseEther("500");
      await token.connect(addr1).burn(burnAmount);
      
      expect(await token.balanceOf(addr1.address)).to.equal(transferAmount.sub(burnAmount));
    });

    it("Should fail if user tries to burn more than they have", async function () {
      const burnAmount = ethers.utils.parseEther("1000");
      await expect(
        token.connect(addr1).burn(burnAmount)
      ).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("Should emit TokensBurned event", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      await token.transfer(addr1.address, transferAmount);
      
      const burnAmount = ethers.utils.parseEther("500");
      await expect(token.connect(addr1).burn(burnAmount))
        .to.emit(token, "TokensBurned")
        .withArgs(addr1.address, burnAmount);
    });

    it("Should handle burning zero tokens", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      await token.transfer(addr1.address, transferAmount);
      
      await token.connect(addr1).burn(0);
      expect(await token.balanceOf(addr1.address)).to.equal(transferAmount);
    });

    it("Should update total supply after burning", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      await token.transfer(addr1.address, transferAmount);
      
      const burnAmount = ethers.utils.parseEther("500");
      const initialSupply = await token.totalSupply();
      
      await token.connect(addr1).burn(burnAmount);
      expect(await token.totalSupply()).to.equal(initialSupply.sub(burnAmount));
    });
  });

  describe("Pausing", function () {
    it("Should allow owner to pause and unpause", async function () {
      await token.pause();
      expect(await token.paused()).to.be.true;

      await token.unpause();
      expect(await token.paused()).to.be.false;
    });

    it("Should fail if non-owner tries to pause", async function () {
      await expect(
        token.connect(addr1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should prevent transfers when paused", async function () {
      await token.pause();
      await expect(
        token.transfer(addr1.address, 100)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should allow transfers after unpausing", async function () {
      await token.pause();
      await token.unpause();
      await token.transfer(addr1.address, 100);
      expect(await token.balanceOf(addr1.address)).to.equal(100);
    });

    it("Should prevent minting when paused", async function () {
      await token.pause();
      await expect(
        token.mint(addr1.address, ethers.utils.parseEther("1000"))
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should prevent burning when paused", async function () {
      const transferAmount = ethers.utils.parseEther("1000");
      await token.transfer(addr1.address, transferAmount);
      
      await token.pause();
      await expect(
        token.connect(addr1).burn(ethers.utils.parseEther("500"))
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should allow all operations after unpausing", async function () {
      await token.pause();
      await token.unpause();
      
      // Test transfer
      await token.transfer(addr1.address, 100);
      expect(await token.balanceOf(addr1.address)).to.equal(100);
      
      // Test minting
      await token.mint(addr2.address, ethers.utils.parseEther("1000"));
      expect(await token.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("1000"));
      
      // Test burning
      await token.connect(addr1).burn(50);
      expect(await token.balanceOf(addr1.address)).to.equal(50);
    });
  });
}); 