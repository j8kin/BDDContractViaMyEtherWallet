Feature:
	Verify Governance contract of access-coin project
	Important: If contract just deployed all Tokens need to be transfered to Governance Proxy
	Background:
		Given I open myEtherWallet.com page
    Given I read current election cycle number
		When I claim "324000000000000000000000000" from "Governance" contract to:
			| Wallet Id |
			| Wallet1   |
			| Wallet2   |
			| Wallet3   |
			| Wallet4   |
			| Wallet5   |

  Scenario: Submit Candidate Phase
  Verify that if Governance election performed during Descision Module election phase then even if new Governance is elected, Governance will not be changed
    Given Current election "cycle" is 1
    When I write "111111" to "setBlockNumber" in "Governance" contract
    Then In "Governance" contract current "stage" is "1"
    #When I perform "submit" with "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13" parameter in "Governance" contract
    Then "candidateCount" in "Governance" contract for "current" cycle is equal to "0"
    #When I perform "submit" with "0x31f379f0ec7b70c8ae92a3cf9d9a1e290779f3d4" parameter in "Governance" contract
    #Then "candidateCount" in "Governance" contract for "current" cycle is equal to "2"
