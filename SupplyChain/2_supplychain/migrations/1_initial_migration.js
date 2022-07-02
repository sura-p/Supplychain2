var ProductManagement = artifacts.require('Supply_Chain');
var ChangeOwnership = artifacts.require('ownwership');

module.exports = function(deployer) {
  deployer.deploy(ProductManagement);
  
};
