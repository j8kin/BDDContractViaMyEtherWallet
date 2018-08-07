@DescisionModule
Feature: DescisionModule Contarct
  Verify DescisionModule contract of access-coin project
  Background: Scenario Initialization
    Given I open myEtherWallet.com page
  Scenario: Contract properties
    Then value of "tokensInCirculation" in "DecisionModule" contract is "1620000000000000000000000000"
            
