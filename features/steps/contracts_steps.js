var chai = require('chai').use(require('chai-as-promised'));
var expect = chai.expect;
const fs = require('fs');

var ContractsSteps = function() {

  var ContractsPage = require("../pages/contract_page.js");

  /*****************************************************************/
  /************************ Hooks **********************************/
  var deployConfig;
  var contracts_abis = {};
  //this.setDefaultTimeout(120 * 1000); // already set in config file

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
  this.Given(/^I open myEtherWallet\.com page$/, {timeout: 120 * 1000}, function (callback) {
    this.page = new ContractsPage(deployConfig, contracts_abis);

    // Write code here that turns the phrase above into concrete actions
    var until = protractor.ExpectedConditions;
    this.page.get().then(()=>{
      // wait 1 sec to popup wellcome window appear
      browser.sleep(1000).then(()=>{
        // click close
        element(by.css('[ng-click="onboardModal.close()"]')).click().then(()=>{
          // select rinkeyby (etherscan.io)
          browser.executeScript("arguments[0].click();", element(by.xpath('//a[contains(text(), "Rinkeby")]'))).then(()=>{
            // wait 1 sec to hide popup wellcome window
            browser.sleep(1000).then(()=>{
              // close welcome popup window
              element(by.css('[ng-click="onboardModal.close()"]')).click().then(()=>{
                // wait 1 sec to hide popup wellcome window
                browser.sleep(1000).then(()=>{
                  // click on Contract Tab
                  element(by.css('[class="nav-item NAV_Contracts"]')).click().then(()=>{
                        callback();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  this.Given(/^Current election "([^"]*)" is (\d+)$/, {timeout: 200 * 1000}, (property, cycle, done) => {
    this.page = new ContractsPage(deployConfig, contracts_abis); //WTF????

    this.page.accessContract("Governance").then(()=>{
      this.page.readContractProperty(property, function(currentCycle) {
        expect(currentCycle).to.equal(cycle);
        done();
      });
    });
  });

  //Then Write setBlockNumber to 111111 in Governance contract
  this.Then(/^Write "([^"]*)" to "([^"]*)" in "([^"]*)" contract/, {timeout: 200 * 1000}, (writeValue, PropName, contractName, done) => {
    this.page = new ContractsPage(deployConfig, contracts_abis); //WTF????

    console.log("Then Write "+writeValue+" to "+PropName+" in "+contractName+" contract");
    done(null, 'pending');
  });
  /*********************Then Steps ********************************/
};

module.exports = ContractsSteps;
