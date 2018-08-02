var request = require("request");
//https://api-rinkeby.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=0x24143452debd43531e953466fde32cab5cac0f0734721f8edf0f80b5ce6230bd&apikey=GY5GVSM43925RIP9181WP41EJU4DDDJ7RC

var RinkebyApi = function(deploy_config) {
  let rinkeybyApiKey = deploy_config["rinkeybyApiKey"];

  this.getTxHashStatus = function(txHash, responce) {
    var url = "https://api-rinkeby.etherscan.io/api?module=transaction&action=getstatus&txhash="+txHash+"&apikey="+rinkeybyApiKey;
    // return a promise so the calling function knows the task has completed
    return request({url: url,json: true}, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        //console.log(body) // Print the json response
        // body example: {"status":"1","message":"OK","result":{"isError":"0","errDescription":""}}
        responce(body["status"]);
      }
      else {
        responce("0");
      }
    });
  };
};

module.exports = RinkebyApi;
