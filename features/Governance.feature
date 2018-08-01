@Governance
Feature: Governance Contarct
	Verify Governance contract of access-coin project
	Important: If contract just deployed all Tokens need to be transfered to Governance Proxy
	Scenario: Initialize Scenario
		Given I open myEtherWallet.com page
		Given I switch to a new election cycle
		Given election cycle is set to 1
		Given Current election "cycle" is 1
		Given I read current election cycle number
		Given I claim "324000000000000000000000000" from "Governance" contract to:
			| Wallet Id |
			| Wallet1   |
			| Wallet2   |
			| Wallet3   |
			| Wallet4   |
			| Wallet5   |

  Scenario: Submit Candidate Phase
  Verify that if Governance election performed during Descision Module election phase then even if new Governance is elected, Governance will not be changed
    Given Current election "cycle" is 1
		Given I read current election cycle number
    When I write "111111" to "setBlockNumber" in "Governance" contract
    Then In "Governance" contract current "stage" is "1"
    When I perform "submit" with "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13" parameter in "Governance" contract
    Then "candidateCount" in "Governance" contract for "current" cycle is equal to "1"
    When I perform "submit" with "0x31f379f0ec7b70c8ae92a3cf9d9a1e290779f3d4" parameter in "Governance" contract
    Then "candidateCount" in "Governance" contract for "current" cycle is equal to "2"

	Scenario: Choose Candidate Phase
	Verify that if stage is 2 then Wallets could choose candidate by send transferSelect request
	Candidate which has most of the votes became finalist
		Given Current election "cycle" is 1
		Given I read current election cycle number
		When I write "222222" to "setBlockNumber" in "Governance" contract
		Then In "Governance" contract current "stage" is "2"
		# allow Wallets participate in election
		When I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet1"
			And I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet2"
			And I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet3"
			And I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet4"
			And I perform "increaseApproval" with "Governance" address and "324000000000000000000000000" in "AccessToken" contract from "Wallet5"
		# Now perform selection
		When I perform "transferSelect" with "Governance1" address and "324000000000000000000000000" in "Governance" contract from "Wallet1"
		Then "finalist" in "Governance" contract for "current" cycle is equal to "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13"
			And "finalistWeight" in "Governance" contract for "current" cycle is equal to "324000000000000000000000001"
		When I perform "transferSelect" with "Governance2" address and "324000000000000000000000000" in "Governance" contract from "Wallet2"
			And I perform "transferSelect" with "Governance2" address and "324000000000000000000000000" in "Governance" contract from "Wallet3"
		Then "finalist" in "Governance" contract for "current" cycle is equal to "0x31f379f0ec7b70c8ae92a3cf9d9a1e290779f3d4"
			And "finalistWeight" in "Governance" contract for "current" cycle is equal to "648000000000000000000000001"
		When I perform "transferSelect" with "Governance1" address and "324000000000000000000000000" in "Governance" contract from "Wallet4"
			And I perform "transferSelect" with "Governance1" address and "324000000000000000000000000" in "Governance" contract from "Wallet5"
		Then "finalist" in "Governance" contract for "current" cycle is equal to "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13"
			And "finalistWeight" in "Governance" contract for "current" cycle is equal to "972000000000000000000000001"

		#Wallet1 vote for Governance1, W2 -> G2, W3 - None, W4 -> G1, W5-> G2
		Then "voterCandidate" in "Governance" contract for "current" cycle and "0xBB64585Fa3c525394C19EBd9F74d9544308065b7" is equal to "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13"
			And "voterCandidate" in "Governance" contract for "current" cycle and "0xC22353f61256F04AeD7655E9F693f9ED71B9bd89" is equal to "0x31f379f0ec7b70c8ae92a3cf9d9a1e290779f3d4"
			And "voterCandidate" in "Governance" contract for "current" cycle and "0x7FD9B14f578E453283c309602499dC578C4A898D" is equal to "0x31f379f0ec7b70c8ae92a3cf9d9a1e290779f3d4"
			And "voterCandidate" in "Governance" contract for "current" cycle and "0xB5e5CBffFC176900402903fd746d573e1728395B" is equal to "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13"
			And "voterCandidate" in "Governance" contract for "current" cycle and "0xF85A21fE0f4E9f685f78620db86964a93878E4Fb" is equal to "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13"
		# Verify CandidateWeight
		Then "candidateWeight" in "Governance" contract for "current" cycle and "0x8dfae32db7256e13e50a361dc8517b1e8ccc3b13" is equal to "972000000000000000000000001"
			And "candidateWeight" in "Governance" contract for "current" cycle and "0x31f379f0ec7b70c8ae92a3cf9d9a1e290779f3d4" is equal to "648000000000000000000000001"

	Scenario: Descision Phase
		Verify that during descision phase wallets could elect selected finalist
		Given I read current election cycle number
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

	Scenario: Close phase
		Verify that even if the isQuorumReached == TRUE the Governance is not changed since current election phase is DM election phase
		Given I read current election cycle number
		When I write "555555" to "setBlockNumber" in "Governance" contract
		Then In "Governance" contract current "stage" is "0"
		When I perform "approve" with "true" parameter in "Governance" contract from "Owner"
		And I perform "close" in "Governance" contract from "Owner"
