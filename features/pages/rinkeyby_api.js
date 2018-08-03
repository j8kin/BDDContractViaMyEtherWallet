var https = require('https');
var defer = protractor.promise.defer();

//https://api-rinkeby.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=0x24143452debd43531e953466fde32cab5cac0f0734721f8edf0f80b5ce6230bd&apikey=GY5GVSM43925RIP9181WP41EJU4DDDJ7RC

var RinkebyApi = function(deploy_config) {
  let rinkeybyApiKey = deploy_config["rinkeybyApiKey"];

  this.getTxHashStatus = function(txHash, responce) {
	var siteUrl = "https://api-rinkeby.etherscan.io/api?module=transaction&action=getstatus&txhash="+txHash+"&apikey="+rinkeybyApiKey;

    https.get(siteUrl, function(response) {
      var bodyString = '';
      response.setEncoding('utf8');

      response.on("data", function(chunk) {
        bodyString += chunk;
      });

      response.on('end', function() {
        defer.fulfill({
          statusCode: response.statusCode,
          bodyString: bodyString
        });
      });
    }).on('error', function(e) {
      defer.reject("Got https.get error: " + e.message);
    });

	// The return is in the following format:
	// { statusCode: 200, bodyString: '{"status":"1","message":"OK","result":{"isError":"0","errDescription":""}}' }
    return defer.promise;
  };
};

module.exports = RinkebyApi;
