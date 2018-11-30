var erc721Meta = artifacts.require("./ERC721Metadata");
var guncore = artifacts.require("./GunCore");

module.exports = function(deployer) {
  //deployer.deploy(erc721);
  deployer.deploy(erc721Meta);
  //deployer.deploy(gunaccesscontrol);
  //deployer.deploy(gunbase);
  deployer.deploy(guncore);
  //deployer.deploy(gunownership);
};
