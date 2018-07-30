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
		Then "voterCandidate" in "Governance" contract for cycle "4" and "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "0x0000000000000000000000000000000000000000"
		Then "candidates" in "Governance" contract for cycle "3" and "candidate number" is "1" equal to "0x31f379f0ec7b70c8ae92a3cf9d9a1e290779f3d4"
		Then "tokenStakes" in "Governance" contract for address "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "0"
		Then "candidateCount" in "Governance" contract for cycle "3" is equal to "2"
		#Then "isQuorumReached" in "Governance" contract for cycle "3" is equal to "TRUE"
