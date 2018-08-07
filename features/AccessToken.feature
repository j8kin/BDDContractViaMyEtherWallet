Feature: AccessToken Contaract
  Verify AccessToken contract of access-coin project
  Background: Scenario Initialization
    Given I open myEtherWallet.com page
  Scenario: Contract properties
    This scenario verify values of "mintingFinished", "name", "totalSupply", "decimals" and "symbol"
    Then value of "mintingFinished" in "AccessToken" contract is "TRUE"
    Then value of "name" in "AccessToken" contract is "AccessToken"
    Then value of "totalSupply" in "AccessToken" contract is "6000000000000000000000000000"
    Then value of "decimals" in "AccessToken" contract is "18"
    Then value of "symbol" in "AccessToken" contract is "ACX"
