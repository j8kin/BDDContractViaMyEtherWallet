var chai = require('chai').use(require('chai-as-promised'));
var expect = chai.expect;
const fs = require('fs');

var ContractsSteps = function() {

  var ContractsPage = require("../pages/contract_page.js");

  /*****************************************************************/
  /************************ Hooks **********************************/
  var deployConfig;
  var contracts_abis = {};
  // current cycle set by "Given I read current election cycle number"-step
  // should called in Background section
  var currentCycle = "0";

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
    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
    this.page = new ContractsPage(deployConfig, contracts_abis);

    // Write code here that turns the phrase above into concrete actions
    //var until = protractor.ExpectedConditions;
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
                browser.sleep(1000).then(()=> done());
              });
            });
          }).catch((err)=> done());;
        });
      });
    });
  });

  this.Given(/^Current election "([^"]*)" is (\d+)$/, {timeout: 2000 * 1000}, (property, cycle, done) => {
    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
    this.page = new ContractsPage(deployConfig, contracts_abis);

    this.page.accessContract("Governance").then(()=>{
      this.page.readContractProperty(property, function(currentCycle) {
        expect(currentCycle).to.equal(cycle);
        done();
      });
    });
  });

  //Given I read current election cycle
  this.Given(/^I read current election cycle number$/, {timeout: 2000 * 1000}, (done) => {
    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
    this.page = new ContractsPage(deployConfig, contracts_abis);

    this.page.accessContract("Governance").then(()=>{
      this.page.readContractProperty("cycleCounter", function(cCycle) {
        currentCycle = cCycle;
        done();
      });
    });
  });

  //Given I switch to a new election cycle
  this.Given(/^I switch to a new election cycle$/, {timeout: 2000 * 1000}, (done) => {
    // to switch to another election cycle it is necessary to perform next following steps:
    // 1. set stage to 0 (set setBlockNumber to 555555)
    // 2. set approve from Owner Wallet
    // 3. set close from Owner Wallet
    // 4. Update currentCycle

    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
    this.page = new ContractsPage(deployConfig, contracts_abis);

    this.page.switchToNextCycle().then(()=>{
      this.page.readContractProperty("cycle", function(cCycle) {
        currentCycle = cCycle;
        done();
      });
    });
  });
  //Given election stage is set to 1
  this.Given(/^election stage is set to (\d)$/, {timeout: 2000 * 1000}, (expStage, done) => {
    // to switch to another election cycle it is necessary to perform next following steps:
    // 1. set stage to 0 (set setBlockNumber to 555555)
    // 2. set approve from Owner Wallet
    // 3. set close from Owner Wallet
    // 4. Update currentCycle

    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
    this.page = new ContractsPage(deployConfig, contracts_abis);

    this.page.readContractProperty("stage", function(cStage) {
      if (cStage == expStage) {
        done();
      }
      else {
        this.page = new ContractsPage(deployConfig, contracts_abis); //WTF???

        this.page.switchToNextCycle().then(()=>{
          this.page.readContractProperty("stage", function(cStage) {
            if (cStage == expStage) {
              done();
            }
            else {
              // there are 3 cycles 1 Governance then 2 DM then 1 Gov 2 DM etc
              // that is why we need max 2 time switch cycle to gain necessary stage
              this.page.switchToNextCycle().then(()=>done());
            }
          });
        });
      }
    });
  });

  this.Given(/^I claim "([^"]*)" from "([^"]*)" contract to:$/, {timeout: 2000 * 1000}, (nTokens, contractName, table, done) => {
    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
    this.page = new ContractsPage(deployConfig, contracts_abis);

    // switch to Check TX status and then back to Contracts to be able to select a new wallet
    var itemsProcessed = 0;
    wallets_to_claim = table.rows();
    wallets_to_claim.forEach((wallet) => {
      this.page.writeContractData("Governance", "claim",nTokens,wallet[0]).then(()=>{
        browser.sleep(2000);
        // this is necessary to avoid situation when test proceed when this step is not complete
        itemsProcessed++;
        if(itemsProcessed === wallets_to_claim.length) {
          // proceed only if all wallets mentioned in steps are processed
          done();
        }
      });
    });
  });

  /*********************When Steps ********************************/
  //example:
  //When I write setBlockNumber to 111111 in Governance contract
  this.When(/^I write "([^"]*)" to "([^"]*)" in "([^"]*)" contract/, {timeout: 2000 * 1000}, (writeValue, PropName, contractName, done) => {
    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
    this.page = new ContractsPage(deployConfig, contracts_abis);
    this.page.writeContractData(contractName, PropName,writeValue, "Wallet1").then(()=>{
      browser.sleep(20000).then(()=>done());
    });
  });

  // When I perform "submit" with "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13" parameter in "Governance" contract
  this.When(/^I perform "([^"]*)" with "([^"]*)" parameter in "([^"]*)" contract/, {timeout: 2000 * 1000}, (propName, writeValue,  contractName, done) => {
    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
    this.page = new ContractsPage(deployConfig, contracts_abis);

    this.page.writeContractData(contractName, propName, writeValue, "Wallet1").then(()=>{
      browser.sleep(20000).then(()=>done());
    });
  });
  //I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet1"
  this.When(/^I perform "([^"]*)" with "([^"]*)" address and "([^"]*)" in "([^"]*)" contract from "([^"]*)"/, {timeout: 2000 * 1000}, (propName, addrName, value, contractName, walletId, done) => {
    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.

    var spenderAddr = "";
    if (addrName.indexOf("Wallet") != -1) {
      spenderAddr = deployConfig['wallets'][addrName+"_ADDR"];
    }
    else {
      spenderAddr = deployConfig['contracts'][addrName];
    }

    this.page = new ContractsPage(deployConfig, contracts_abis); //WTF???

    this.page.writeContractData2(contractName, propName, spenderAddr, value, walletId).then(()=>{
      browser.sleep(20000).then(()=>done());
    });
  });
  /*********************Then Steps ********************************/
  /**** These steps are used only to verify some data in contract */
  /**** avoid to set any values in these steps                    */
  //////////////////////////////////////////////////////////////////
  //for example:
  //Then In "Governance" contract current "stage" is "1"
  this.Then(/^In "([^"]*)" contract current "([^"]*)" is "([^"]*)"$/, function (contractName, propName, expectedVal, done) {
    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
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
    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
    this.page = new ContractsPage(deployConfig, contracts_abis);

    this.page.writeContractData(contractName, PropName,writeValue, walletId).then(()=>{
      done();
    });
  });

  //Then "voterCandidate" in "Governance" contract for "4" cycle and "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "0x0000000000000000000000000000000000000000"
  //Then "voterCandidate" in "Governance" contract for "current" cycle and "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "0x0000000000000000000000000000000000000000"
  this.Then(/^"([^"]*)" in "([^"]*)" contract for  "([^"]*)" cycle and "([^"]*)" is equal to "([^"]*)"$/, function (propName, contractName, cycleNum, address, expectedVal, done) {
    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
    this.page = new ContractsPage(deployConfig, contracts_abis);

    this.page.accessContract(contractName).then(()=>{
      var cCycle = cycleNum;
      if (cCycle == "current")
      {
        cCycle = currentCycle;
      }
      this.page.readContractDataCycleAddr(propName, cCycle, address, function(val) {
        expect(val).to.equal(expectedVal);
        done();
      });
    });
    // Write code here that turns the phrase above into concrete actions
    //done(null, 'pending');
  });

  //Then "candidates" in "Governance" contract for "3" cycle and "candidate number" is "0" equal to "0x31f379f0ec7b70c8ae92a3cf9d9a1e290779f3d4"
  //Then "candidates" in "Governance" contract for "current" cycle and "candidate number" is "0" equal to "0x31f379f0ec7b70c8ae92a3cf9d9a1e290779f3d4"
  //And "voterCandidate" in "Governance" contract for "current" cycle and "0xF85A21fE0f4E9f685f78620db86964a93878E4Fb" is equal to "0x31f379f0ec7b70c8ae92a3cf9d9a1e290779f3d4"
  //Then "voterCandidate" in "Governance" contract for "current" cycle and "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13"
  this.Then(/^"([^"]*)" in "([^"]*)" contract for "([^"]*)" cycle and "([^"]*)" is equal to "([^"]*)"$/, function (propName, contractName, cycleNum, intVal, expectedVal, done) {
    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
    this.page = new ContractsPage(deployConfig, contracts_abis);
    this.page.accessContract(contractName).then(()=>{
      var cCycle = cycleNum;
      if (cCycle == "current")
      {
        cCycle = currentCycle;
      }
      if (intVal.startsWith("0x")){
        this.page.readContractDataCycleAddr(propName, cCycle, intVal, function(val) {
          expect(val).to.equal(expectedVal);
          done();
        });
      }
      else {
        this.page.readContractDataTwoInt(propName, cCycle, intVal, function(val) {
          expect(val).to.equal(expectedVal);
          done();
        });
      }
    });
  });

  //Then "tokenStakes" in "Governance" contract for address "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "0"
  this.Then(/^"([^"]*)" in "([^"]*)" contract for address "([^"]*)" is equal to "([^"]*)"$/, function (propName, contractName, address, expectedVal, done) {
    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
    this.page = new ContractsPage(deployConfig, contracts_abis);

    this.page.accessContract(contractName).then(()=>{
      this.page.readContractDataByAddress(propName, address, function(val) {
        expect(val).to.equal(expectedVal);
        done();
      });
    });
  });

  //Then "candidateCount" in "Governance" contract for "3" cycle is equal to "4"
  //Then "candidateCount" in "Governance" contract for "current" cycle is equal to "4"
  this.Then(/^"([^"]*)" in "([^"]*)" contract for "([^"]*)" cycle is equal to "([^"]*)"$/, function (propName, contractName, cycleNum, expectedVal, done) {
    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
    this.page = new ContractsPage(deployConfig, contracts_abis);

    var cCycle = cycleNum;
    if (cCycle == "current")
    {
      cCycle = currentCycle;
    }

    this.page.accessContract(contractName).then(()=>{
      if (expectedVal.toLowerCase() == 'true' || expectedVal.toLowerCase() == 'false')
      {
        this.page.readContractDataValueBool(propName, cCycle, function(val) {
          expect(val.toLowerCase()).to.equal(expectedVal.toLowerCase());
          done();
        });
      }
      else {
        this.page.readContractDataValue(propName, cCycle, function(val) {
          expect(val).to.equal(expectedVal);
          done();
        });
      }
    });
  });

  //Then "candidateVoters" in "Governance" contract for "2" cycle and "candidate address" "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13" and "voters address" "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "324000000000000000000000000"
  //Then "candidateVoters" in "Governance" contract for "current" cycle and "candidate address" "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13" and "voters address" "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "324000000000000000000000000"
  this.Then(/^"([^"]*)" in "([^"]*)" contract for "([^"]*)" cycle and "([^"]*)" "([^"]*)" and "([^"]*)" "([^"]*)" is equal to "([^"]*)"$/, function (propName, contractName, cycleNum, dummyStr1, addr1, dummyStr2, addr2, expectedVal, done) {
    // Write code here that turns the phrase above into concrete actions
    //WTF???? for unknown reason it is necessary to create this field in each step otherwise this.page is undefined.
    this.page = new ContractsPage(deployConfig, contracts_abis); //WTF????

    this.page.accessContract(contractName).then(()=>{
      var cCycle = cycleNum;
      if (cCycle == "current")
      {
        cCycle = currentCycle;
      }
      this.page.readContractDataValue3(propName, cCycle, addr1, addr2, function(val) {
        expect(val).to.equal(expectedVal);
        done();
      });
    });
  });
  //done(null, 'pending');
};

module.exports = ContractsSteps;
