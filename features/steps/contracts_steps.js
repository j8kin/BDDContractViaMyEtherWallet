var chai = require('chai').use(require('chai-as-promised'));
var expect = chai.expect;
const fs = require('fs');

var ContractsSteps = function() {

  var ContractsPage = require("../pages/contract_page.js");

  /*****************************************************************/
  /************************ Hooks **********************************/
  var deployConfig;
  var contracts_abis = {};
  browser.manage().timeouts().setScriptTimeout(6000000);
  
  this.setDefaultTimeout(2000 * 1000); // already set in config file

  // add a before feature hook
  this.BeforeFeature(function(feature, done) {
      // load configuration
      fs.readFile('./features/shared-objects/deploy_config.json', 'utf8', function (err, data) {
        if (err) throw err;
        deployConfig = JSON.parse(data);
      });
      fs.readdir('./features/shared-objects/contracts', function(err, filenames) {
        if (err) throw err;

        filenames.forEach(function(filename) {
          fs.readFile('./features/shared-objects/contracts/' + filename, 'utf-8', function(err, content) {
            if (err) throw err;
            let contractName = filename.substring(0,filename.indexOf("."));
            contracts_abis[contractName] = JSON.parse(content);

            done(); // allow to execute other steps only if this hook completed
          });
        });
      });
  });

  /*****************************************************************/
  /*********************Given Steps ********************************/
  this.Given(/^I open myEtherWallet\.com page$/, {timeout: 2000 * 1000}, (done) => {
    this.page = new ContractsPage(deployConfig, contracts_abis);

    // Write code here that turns the phrase above into concrete actions
    var until = protractor.ExpectedConditions;
    this.page.get().then(()=>{
      // wait 1 sec to popup wellcome window appear
      browser.sleep(1000).then(()=>{
        // click close
        element.all(by.css('[ng-click="onboardModal.close()"]')).first().click().then(()=>{
          // select rinkeyby (etherscan.io)
          browser.executeScript("arguments[0].click();", element.all(by.xpath('//a[contains(text(), "Rinkeby")]')).first()).then(()=>{
            // wait 1 sec to hide popup wellcome window
            browser.sleep(1000).then(()=>{
              // close welcome popup window
              element.all(by.css('[ng-click="onboardModal.close()"]')).first().click().then(()=>{
                // wait 1 sec to hide popup wellcome window
                browser.sleep(1000).then(()=>{
                  // click on Contract Tab
                  //element(by.css('[@class="nav-item NAV_Contracts"]')).click().then(()=>{
                  element(by.xpath('//*[@class="nav-item NAV_Contracts" or @class="nav-item NAV_Contracts active"]')).click().then(()=>{
                      done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  this.Given(/^Current election "([^"]*)" is (\d+)$/, {timeout: 2000 * 1000}, (property, cycle, done) => {
    this.page = new ContractsPage(deployConfig, contracts_abis); //WTF????

    this.page.accessContract("Governance").then(()=>{
      this.page.readContractProperty(property, function(currentCycle) {
        expect(currentCycle).to.equal(cycle);
        done();
      });
    });
  });
  /*********************When Steps ********************************/
  this.When(/^I claim "([^"]*)" from "([^"]*)" contract to:$/, {timeout: 2000 * 1000}, (nTokens, contractName, table, done) => {
    // switch to Check TX status and then back to Contracts to be able to select a new wallet
    var itemsProcessed = 0;
    wallets_to_claim = table.rows();
    wallets_to_claim.forEach((wallet) => {
      this.page.writeContractData("Governance", "claim",nTokens,wallet[0]).then(()=>{
        browser.sleep(2000);
        itemsProcessed++;
        if(itemsProcessed === wallets_to_claim.length) {
          done();
        }
      });
    });
  });

  //example:
  //When I write setBlockNumber to 111111 in Governance contract
  this.When(/^I write "([^"]*)" to "([^"]*)" in "([^"]*)" contract/, {timeout: 2000 * 1000}, (writeValue, PropName, contractName, done) => {
    this.page = new ContractsPage(deployConfig, contracts_abis); //WTF????
	
	this.page.writeContractData(contractName, PropName,writeValue, "Wallet1").then(()=>{
		done();
	});
  });
  
  /*********************Then Steps ********************************/
  //for example:
  //Then In "Governance" contract current "stage" is "1"
  this.Then(/^In "([^"]*)" contract current "([^"]*)" is "([^"]*)"$/, function (contractName, propName, expectedVal, done) {
    // Write code here that turns the phrase above into concrete actions
    this.page = new ContractsPage(deployConfig, contracts_abis); //WTF????

    this.page.accessContract(contractName).then(()=>{
      this.page.readContractProperty(propName, function(val) {
        expect(val).to.equal(expectedVal);
        done();
      });
    });
  });
	   
  //Then Write "submit" to "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13" in Governance contract from Wallet1
  this.Then(/^Write "([^"]*)" to "([^"]*)" in "([^"]*)" contract from "([^"]*)"/, {timeout: 2000 * 1000}, (writeValue, PropName, contractName, walletId, done) => {
    this.page = new ContractsPage(deployConfig, contracts_abis); //WTF????
	
	this.page.writeContractData(contractName, PropName,writeValue, walletId).then(()=>{
		done();
	});
  });

};

module.exports = ContractsSteps;
