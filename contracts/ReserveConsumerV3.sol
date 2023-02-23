// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ReserveConsumerV3 {
    AggregatorV3Interface internal reserveFeed;

    /**
     * Network: Ethereum Goerli
     * Aggregator: Stader Labs PoR
     * Address: 0x3de1bE9407645533CD0CbeCf88dFE5297E7125e6
     */
    constructor(address reserveFeedAddress) {
        reserveFeed = AggregatorV3Interface(reserveFeedAddress);
    }

    /**
     * Returns the latest price
     */
    function getLatestReserve() public view returns (int) {
        // prettier-ignore
        (
            /*uint80 roundID*/,
            int reserve,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = reserveFeed.latestRoundData();

        return reserve;
    }
}
