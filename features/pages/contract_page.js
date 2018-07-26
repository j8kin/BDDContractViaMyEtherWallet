var chai = require('chai').use(require('chai-as-promised'));
var expect = chai.expect;

var ContractorPage = function(deploy_config, contracts_abis) {
  let deployConfig = deploy_config;
  let contractsAbis = contracts_abis;

  this.get = function() {
    return browser.get('https://www.myetherwallet.com');
  };

  this.accessContract = function(contractName) {
    let contract_ADDR = deployConfig["contracts"][contractName];//"0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D";
    let contract_abi = JSON.stringify(contractsAbis[contractName]);
    return element(by.css('[placeholder="mewtopia.eth or 0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"]')).sendKeys(contract_ADDR).then(()=>{
      element(by.css('[ng-model="contract.abi"]')).sendKeys(contract_abi).then(()=>{
        element(by.css('[ng-click="initContract()"]')).click();
      });
    });
  };

  this.selectRWContract = function(RWProp){
    return element(by.css('[class="btn btn-default ng-binding"]')).click().then(()=>{
      //contract names could be simular (cycle, cycleCounter etc) that is why
      // get all contracts and click only were this text is the same as contract Property name
      element.all(by.xpath('//a[contains(text(), "' + RWProp + '")]')).then((items) => {
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          item.getText().then((text)=>{
            if (text == RWProp){
              return item.click();
            }
          });
        }
      });
    });
  };

  this.readContractProperty = function(contractProperty, fn) {
    // return a promise so the calling function knows the task has completed
    return this.selectRWContract(contractProperty).then(()=>{
      // give 2 sec for myetherwallet to get data from rinkeyby contract
      browser.sleep(2000).then(()=>{
        element(by.css('[placeholder="151"]')).getAttribute('value').then((value) => {
          fn(value);
        });
      });
    })
  };

  this.setOperator = function(value) {
    element(by.model('operator')).element(by.cssContainingText('option', value)).click();
  };

  this.getResult = function() {
    return element(by.binding('latest')).getText();
  };

  this.clickGo = function() {
    element(by.id('gobutton')).click()
  }
};

module.exports = ContractorPage;
