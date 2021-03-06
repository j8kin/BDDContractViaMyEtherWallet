@ignore
Feature: Test Example
	Verify Governance contract of access-coin project
	Important: If contract just deployed all Tokens need to be transfered to Governance Proxy
	Background: init test
		Given I open myEtherWallet.com page
		#Given I switch to a new election cycle
		#Given I read current election cycle number
		#When I claim "324000000000000000000000000" from "Governance" contract to:
		#	| Wallet Id |
		#	| Wallet1   |
		#	| Wallet2   |
		#	| Wallet3   |
		#	| Wallet4   |
		#	| Wallet5   |

  Scenario Outline: Test Scenario
  Verify that if Governance election performed during Descision Module election phase then even if new Governance is elected, Governance will not be changed
    #Given Current election "cycle" is 1
		#Then "voterCandidate" in "Governance" contract for "99" cycle and "Wallet1" is equal to "Governance1"
		#Given Current election cycle is <electionCycle>
		#When I write "222222" to "setBlockNumber" in "Governance" contract
		#Then the last transaction is "Success"
		#When I write "222222" to "setBlockNumber" in "Governance" contract
		#Then read 30 seconds last transaction Hash
		#Then "finalistWeight" in "Governance" contract for "current" cycle is equal to "972000000000000000000000001"
    #When I write "111111" to "setBlockNumber" in "Governance" contract
		#Then In "Governance" contract current "stage" is "1"
		#Then "voterCandidate" in "Governance" contract for "1" cycle and "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "0x0000000000000000000000000000000000000000"
		#Then "candidates" in "Governance" contract for "3" cycle and "candidate number" is "1" equal to "0x31f379f0ec7b70c8ae92a3cf9d9a1e290779f3d4"
		#Then "tokenStakes" in "Governance" contract for address "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "0"
		#Then "candidateCount" in "Governance" contract for "3" cycle is equal to "2"
		#Then "isQuorumReached" in "Governance" contract for "3" cycle is equal to "false"
		#Then "isQuorumReached" in "Governance" contract for "2" cycle is equal to "true"
		#Then "candidateVoters" in "Governance" contract for "2" cycle and "candidate address" "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13" and "voters address" "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "324000000000000000000000000"
		When I perform "claim" from "Governance" contract with:
			| ACX                         | Wallet Id |
			| 324000000000000000000000000 | Wallet1   |
			| 324000000000000000000000000 | Wallet2   |
			| 324000000000000000000000000 | Wallet3   |
			| 324000000000000000000000000 | Wallet4   |
			| 324000000000000000000000000 | Wallet5   |

#		When I perform "increaseApproval" from "AccessToken" contract with:
#			| Address    | ACX                         | Wallet Id |
#			| Governance | 324000000000000000000000000 | Wallet1   |
#			| Governance | 324000000000000000000000000 | Wallet2   |
#			| Governance | 324000000000000000000000000 | Wallet3   |
#			| Governance | 324000000000000000000000000 | Wallet4   |
#			| Governance | 324000000000000000000000000 | Wallet5   |

Examples:
	| electionCycle      | candidate1        | candidate2        |
	| "DecisionModule"   | "DecisionModule1" | "DecisionModule2" |
