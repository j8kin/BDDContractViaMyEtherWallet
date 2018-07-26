Feature: Verify Governance contract of access-coin project
  Background:
    Given I open myEtherWallet.com page
  Scenario:
  Verify that if Governance election performed during Descision Module election phase then even if new Governance is elected, Governance will not be changed
    Given Current election "cycle" is 1
    Then Write "111111" to "setBlockNumber" in "Governance" contract
