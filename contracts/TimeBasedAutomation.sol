// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

/**
 * @dev This contract is deployed at 0xF282bA0d5DD3fa4Cb875078DAeB920Daa95e6c06
 * @dev Its Upkeep Id is 7331023558585809891709200873845425691463273897797259813210058513847440270174
 * @dev This contract is funded 10 LINK tokens initially and its cron job interval is set to 15 minutes.
 * @dev This will automatically stop incrementing once balance will be less than minimum balance.
 */
contract TimeBasedAutomation {
    uint256 public counter;

    function automate() external {
        counter++;
    }
}
