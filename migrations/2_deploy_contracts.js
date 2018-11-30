//var erc721 = artifacts.require("./ERC721");
var erc721Meta = artifacts.require("./ERC721Metadata");
//var gunaccesscontrol = artifacts.require("./GunAccessControl");
//var gunbase = artifacts.require("./GunBase");
var guncore = artifacts.require("./GunCore");
//var gunownership = artifacts.require("./GunOwnership");

module.exports = function(deployer) {
  //deployer.deploy(erc721);
  deployer.deploy(erc721Meta);
  //deployer.deploy(gunaccesscontrol);
  //deployer.deploy(gunbase);
  deployer.deploy(guncore);
  //deployer.deploy(gunownership);
};
