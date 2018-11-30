var erc721Meta = artifacts.require("./ERC721Metadata");
var guncore = artifacts.require("./GunCore");

contract("guncore", function(accounts) {
	it("Registering then transferring a gun.", function() {
		return guncore.deployed().then(function(instance) {
			app = instance;
			return app.createGun("hand gun", "P3891N", "W&S", {from: accounts[0]});
		}).then(function(receipt) {
			return app.ownerOf(1);
		}).then(function(owner) {
			assert.equal(owner, accounts[0], "Correct account registered gun");
			return app.totalSupply(); 
		}).then(function(supply) {
			assert.equal(supply, 1, "Total supply is 1.");
			return app.transfer(accounts[3], 1, {from: accounts[0]}) 
		}).then(function(receipt) {
			return app.ownerOf(1);
		}).then(function(newOwner) {
			assert.equal(newOwner, accounts[3], "Successfully transferring a gun");
			return app.totalSupply();
		}).then(function(totalSupply) {
			assert.equal(totalSupply, 1, "Total supply should now change.");
		})
	})
})