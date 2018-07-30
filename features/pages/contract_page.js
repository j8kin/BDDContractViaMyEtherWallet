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
    //Set Contract Address
    //return browser.executeScript("arguments[0].setAttribute('value', '" + contract_ADDR +"')",element( by.css('[placeholder="mewtopia.eth or 0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"]'))).then(()=>{
    return browser.executeScript("arguments[0].value = '';",element(by.css('[placeholder="mewtopia.eth or 0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"]'))).then(()=>{
      //set contract address
      element(by.css('[placeholder="mewtopia.eth or 0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"]')).sendKeys(contract_ADDR).then(()=>{
        // set contract Abi
        browser.executeScript("arguments[0].value = '"+contract_abi+"';",element(by.xpath('//textarea[@rows="6" and @ng-model="contract.abi"]'))).then(()=>{
          browser.sleep(2000).then(()=>{
            //send extra space for unknown reason otherwise abi is invalid
            element(by.xpath('//textarea[@rows="6" and @ng-model="contract.abi"]')).sendKeys(" ").then(()=>{
              browser.sleep(5000).then(()=>{
                //Click on Access Button
                element(by.css('[ng-click="initContract()"]')).click();
              });
            });
          });
        });
      });
    });
  };

  this.selectRWContract = function(RWProp){
    return element(by.css('[class="btn btn-default ng-binding"]')).click().then(()=>{
      //contract names could be simular (cycle, cycleCounter etc) that is why
      // get all contracts and click only were this text is the same as contract Property name
      element.all(by.xpath('//a[contains(text(), "' + RWProp + '") and @ng-click="selectFunc($index)"]')).then((items) => {
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          item.getText().then((text)=>{
            //console.log(text);
            if (text == RWProp){
              //console.log("'"+text+"' == '" + RWProp +"'");
              item.click();
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

  /******************************************************************************/
  /********************** READ CONTRACT PROPERTIES ******************************/
  /**
   * (internal) Click on Read button and return value read from Contract
   * @returns {Promise} a promise with read value
   */
  this.clickAndRead = function(func) {
    //Press "Read" button
    element(by.css('[ng-click="readFromContract()"]')).click().then(()=>{
      // give 2 sec for myetherwallet to get data from rinkeyby contract
      browser.sleep(2000).then(()=>{
        // read output value and return
        element(by.css('[ng-model="output.value"]')).getAttribute('value').then((value) => {
          func(value);
        });
      });
    });
  };

  this.readContractDataCycleAddr = function(contractProperty, cycleNum, address, fn) {
    // return a promise so the calling function knows the task has completed
    return this.selectRWContract(contractProperty).then(()=>{
      // set cycle Number
      element(by.css('[placeholder="151"]')).sendKeys(cycleNum).then(()=>{
        // set address (for example "0x31f379f0ec7b70c8ae92a3cf9d9a1e290779f3d4")
        element.all(by.css('[placeholder="0x314156..."]')).first().sendKeys(address).then(()=>{
          this.clickAndRead((output) => {fn(output)});
        });
      });
    })
  };

  /**
   * Read Contract Data with Input parameter equal to int
   * @param {string} contractProperty Contract Property to be read
   * @param {string} intInVal1 first input integer value
   * @param {string} intInVal2 secont input integer value
   * @returns {Promise} a promise with read value
   * for different types different input data generated on page that is why need 2 different functions
   */
  this.readContractDataTwoInt = function(contractProperty, intInVal1, intInVal2, fn) {
    // return a promise so the calling function knows the task has completed
    return this.selectRWContract(contractProperty).then(()=>{
      element.all(by.css('[placeholder="151"]')).then((items)=>{
        //expect(items.length).toBe(2); //just to make sure that evrything is ok
        // set first input integer value
        items[0].sendKeys(intInVal1);
        // set second input integer value
        items[1].sendKeys(intInVal2);
        // wait 1 sec to make sure that both values are put before we press "Read"
        browser.sleep(1000).then(()=>{
          this.clickAndRead((output) => {fn(output)});
        });
      });
    })
  };

  /**
   * Read Contract Data with Input parameter equal to int
   * @param {string} contractProperty Contract Property to be read
   * @param {string} address address to be used to access property (for example 0xBB64585Fa3c525394C19EBd9F74d9544308065b7)
   * @returns {Promise} a promise with read value
   */
  this.readContractDataByAddress = function(contractProperty, address, fn) {
    return this.selectRWContract(contractProperty).then(()=>{
      // place address
      element.all(by.css('[placeholder="0x314156..."]')).first().sendKeys(address).then(()=>{
        this.clickAndRead((output) => {fn(output)});
      });
    });
  };

  /**
   * Read Contract Data with Input parameter equal to int
   * @param {string} contractProperty Contract Property to be read
   * @param {string} inputStr parameter string
   * @returns {Promise} a promise with read value
   */
  this.readContractDataValue = function(contractProperty, inputStr, fn) {
    return this.selectRWContract(contractProperty).then(()=>{
      element.all(by.css('[placeholder="151"]')).first().sendKeys(inputStr).then(()=>{
        this.clickAndRead((output) => {fn(output)});
      });
    });
  };

  /******************************************************************************/

  this.writeContractData = function(contractName, contractProperty, value, walletId) {
    // return a promise so the calling function knows the task has completed
    //console.log("Set " + contractProperty + " to "+ value + " from wallet: '"+walletId+"'");
    return element(by.css('[class="nav-item NAV_CheckTxStatus"]')).click().then(()=>{
      browser.sleep(2000).then(()=>{
        element(by.xpath('//*[@class="nav-item NAV_Contracts" or @class="nav-item NAV_Contracts active"]')).click().then(()=>{
          browser.sleep(1000).then(()=>{
            this.accessContract(contractName).then(()=>{
              this.selectRWContract(contractProperty).then(()=>{
                element(by.css('[placeholder="151"]')).sendKeys(value).then(()=>{
                  // verify that it is necessary to choose Wallet
                  browser.isElementPresent(by.xpath('//input[@ng-model="walletType" and @value="pasteprivkey"]')).then((unlockWallet)=>{
                    if (unlockWallet){
                      //Click on Private Key
                      if (walletId == "")
                      {
                        walletId = "Wallet1"
                      }
                      let wallet_PK = deployConfig["wallets"][walletId+"_PK"];
                      element(by.xpath('//input[@ng-model="walletType" and @value="pasteprivkey"]')).click().then(()=>{
                        element(by.css('[ng-change="onPrivKeyChange()"]')).sendKeys(wallet_PK).then(()=>{
                          //press Unlock wallet button
                          element(by.css('[ng-click="decryptWallet()"]')).click();
                        });
                      });
                    }
                    element(by.css('[ng-click="generateContractTx()"]')).click().then(()=>{
                      browser.sleep(1000).then(()=>{
                        //generate transaction
                        element.all(by.css('[ng-model="tx.gasLimit"]')).first().sendKeys("5000000").then(()=>{
                          //select transaction
                          element.all(by.css('[ng-click="generateTx()"]')).first().click().then(()=>{
                            browser.sleep(1000).then(()=>{
                              // Click "I'm sure'
                              //TODO: probably it is necessary to return transaction Hash
                              element.all(by.css('[ng-click="sendTx()"]')).first().click();
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  };
 };

module.exports = ContractorPage;
