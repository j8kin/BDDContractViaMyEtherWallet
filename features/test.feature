Feature: Test
	Verify Governance contract of access-coin project
	Important: If contract just deployed all Tokens need to be transfered to Governance Proxy
	Background: init test
		Given I open myEtherWallet.com page
		#Given I read current election cycle number
		#When I claim "324000000000000000000000000" from "Governance" contract to:
		#	| Wallet Id |
		#	| Wallet1   |
		#	| Wallet2   |
		#	| Wallet3   |
		#	| Wallet4   |
		#	| Wallet5   |

  Scenario: Test Scenario
  Verify that if Governance election performed during Descision Module election phase then even if new Governance is elected, Governance will not be changed
    Given Current election "cycle" is 1
    #When I write "111111" to "setBlockNumber" in "Governance" contract
		#Then In "Governance" contract current "stage" is "1"
		#Then "voterCandidate" in "Governance" contract for "1" cycle and "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "0x0000000000000000000000000000000000000000"
		#Then "candidates" in "Governance" contract for "3" cycle and "candidate number" is "1" equal to "0x31f379f0ec7b70c8ae92a3cf9d9a1e290779f3d4"
		#Then "tokenStakes" in "Governance" contract for address "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "0"
		#Then "candidateCount" in "Governance" contract for "3" cycle is equal to "2"
		#Then "isQuorumReached" in "Governance" contract for "3" cycle is equal to "false"
		#Then "isQuorumReached" in "Governance" contract for "2" cycle is equal to "true"
		#Then "candidateVoters" in "Governance" contract for "2" cycle and "candidate address" "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13" and "voters address" "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "324000000000000000000000000"
