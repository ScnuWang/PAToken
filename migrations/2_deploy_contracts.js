var PAToken = artifacts.require("PAToken");

module.exports = function(deployer) {
  deployer.deploy(PAToken);
};
