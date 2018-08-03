@Governance
@DecisionModule
Feature: Election cycle
	This test verify election cycle both for Governance and DecisionModule contract
	Important: If contract just deployed all Tokens need to be transfered to Governance Proxy
	Scenario Outline: Election cycle
		Given I open myEtherWallet.com page
		Given I switch to a new election cycle
		Given election cycle is set to <electionCycle>
		Given Current election cycle is <electionCycle>
		Given I read current election cycle number
		Given I claim "324000000000000000000000000" from "Governance" contract to:
			| Wallet Id |
			| Wallet1   |
			| Wallet2   |
			| Wallet3   |
			| Wallet4   |
			| Wallet5   |

		#Submit Candidate Phase
		#Verify that if Governance election performed during Descision Module election phase then even if new Governance is elected, Governance will not be changed
		Given Current election cycle is <electionCycle>
		Given I read current election cycle number
		When I write "111111" to "setBlockNumber" in "Governance" contract
		Then In "Governance" contract current "stage" is "1"
		When I perform "submit" with <candidate1> parameter in "Governance" contract
		Then "candidateCount" in "Governance" contract for "current" cycle is equal to "1"
		When I perform "submit" with <candidate2> parameter in "Governance" contract
		Then "candidateCount" in "Governance" contract for "current" cycle is equal to "2"

	# Choose Candidate Phase
	# Verify that if stage is 2 then Wallets could choose candidate by send transferSelect request
	# Candidate which has most of the votes became finalist
		When I write "222222" to "setBlockNumber" in "Governance" contract
		Then In "Governance" contract current "stage" is "2"
		# allow Wallets participate in election
		When I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet1"
			And I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet2"
			And I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet3"
			And I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet4"
			And I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet5"
		# Now perform selection
		When I perform "transferSelect" with <candidate1> address and "324000000000000000000000000" in "Governance" contract from "Wallet1"
		Then "finalist" in "Governance" contract for "current" cycle is equal to <candidate1>
			And "finalistWeight" in "Governance" contract for "current" cycle is equal to "324000000000000000000000001"
		When I perform "transferSelect" with <candidate2> address and "324000000000000000000000000" in "Governance" contract from "Wallet2"
			And I perform "transferSelect" with <candidate2> address and "324000000000000000000000000" in "Governance" contract from "Wallet3"
		Then "finalist" in "Governance" contract for "current" cycle is equal to <candidate2>
			And "finalistWeight" in "Governance" contract for "current" cycle is equal to "648000000000000000000000001"
		When I perform "transferSelect" with <candidate1> address and "324000000000000000000000000" in "Governance" contract from "Wallet4"
			And I perform "transferSelect" with <candidate1> address and "324000000000000000000000000" in "Governance" contract from "Wallet5"
		Then "finalist" in "Governance" contract for "current" cycle is equal to <candidate1>
			And "finalistWeight" in "Governance" contract for "current" cycle is equal to "972000000000000000000000001"

		#Wallet1 vote for candidate1, W2 -> candidate2, W3 - candidate2, W4 -> candidate1, W5-> candidate1
		Then "voterCandidate" in "Governance" contract for "current" cycle and "Wallet1" is equal to <candidate1>
			And "voterCandidate" in "Governance" contract for "current" cycle and "Wallet2" is equal to <candidate2>
			And "voterCandidate" in "Governance" contract for "current" cycle and "Wallet3" is equal to <candidate2>
			And "voterCandidate" in "Governance" contract for "current" cycle and "Wallet4" is equal to <candidate1>
			And "voterCandidate" in "Governance" contract for "current" cycle and "Wallet5" is equal to <candidate1>
		# Verify CandidateWeight
		Then "candidateWeight" in "Governance" contract for "current" cycle and <candidate1> is equal to "972000000000000000000000001"
			And "candidateWeight" in "Governance" contract for "current" cycle and <candidate2> is equal to "648000000000000000000000001"

	# Descision Phase
	# Verify that during descision phase wallets could elect selected finalist
		When I write "444444" to "setBlockNumber" in "Governance" contract
		Then In "Governance" contract current "stage" is "3"
		Given I claim "324000000000000000000000000" from "Governance" contract to:
			| Wallet Id |
			| Wallet1   |
			| Wallet2   |
			| Wallet3   |
			| Wallet4   |
			| Wallet5   |
		# allow Wallets participate in descision
		When I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet1"
			And I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet2"
			And I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet3"
			And I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet4"
			And I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet5"
		When I perform "transferDecide" with "324000000000000000000000000" parameter in "Governance" contract from "Wallet1"
		Then "isQuorumReached" in "Governance" contract for "current" cycle is equal to "false"
		When I perform "transferDecide" with "324000000000000000000000000" parameter in "Governance" contract from "Wallet2"
		Then "isQuorumReached" in "Governance" contract for "current" cycle is equal to "false"
		When I perform "transferDecide" with "324000000000000000000000000" parameter in "Governance" contract from "Wallet3"
		Then "isQuorumReached" in "Governance" contract for "current" cycle is equal to "true"

	# Close phase
	#	Verify that even if the isQuorumReached == TRUE the Governance is not changed since current election phase is DM election phase
		When I write "555555" to "setBlockNumber" in "Governance" contract
		Then In "Governance" contract current "stage" is "0"
		When I perform "approve" with "true" parameter in "Governance" contract from "Owner"
		And I perform "close" in "Governance" contract from "Owner"

Examples:
	| electionCycle      | candidate1        | candidate2        |
	| "Governance"       | "Governance1"     | "Governance2"     |
	| "DecisionModule"   | "DecisionModule1" | "DecisionModule2" |	
