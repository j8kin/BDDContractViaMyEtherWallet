Feature: 
	Verify Governance contract of access-coin project
	Important: If contract just deployed all Tokens need to be transfered to Governance Proxy
  Background:
    Given I open myEtherWallet.com page
	When I claim "324000000000000000000000000" from "Governance" contract to:
		| Wallet Id |
		| Wallet1   |
		| Wallet2   |
		| Wallet3   |
		| Wallet4   |
		| Wallet5   |
		
  Scenario:
  Verify that if Governance election performed during Descision Module election phase then even if new Governance is elected, Governance will not be changed
    Given Current election "cycle" is 1
    When I write "111111" to "setBlockNumber" in "Governance" contract
	Then In "Governance" contract current "stage" is "1"
