// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// * AutomationCompatible.sol imports the functions from both ./AutomationBase.sol and
// * ./interfaces/AutomationCompatibleInterface.sol

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract CustomLogicAutomation is AutomationCompatibleInterface {
    uint public counter;

    /**
     * * Use an interval in seconds and a timestamp to slow execution of Upkeep
     */
    uint public immutable interval;
    uint public lastTimeStamp;

    constructor(uint updateInterval) {
        interval = updateInterval;
        lastTimeStamp = block.timestamp;

        counter = 0;
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        return (upkeepNeeded, "0x");
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            counter = counter + 1;
        }
    }
}
