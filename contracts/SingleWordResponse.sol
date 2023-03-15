// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract SingleWordResponse is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 public volume;
    bytes32 private jobId;
    uint256 private fee;

    event RequestVolume(bytes32 indexed requestId, uint256 volume);

    /**
     * @notice Initialize the link token and target oracle
     *
     * * Sepolia Testnet details:
     * * Link Token: 0x779877A7B0D9E8603169DdbD7836e478b4624789
     * * Oracle: 0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD
     * * jobId: ca98366cc7314957b8c012c72f05aeeb
     *
     */
    constructor(
        address linkTokenAddress,
        address oracleAddress,
        bytes32 jobIdentifier
    ) ConfirmedOwner(msg.sender) {
        setChainlinkToken(linkTokenAddress);
        setChainlinkOracle(oracleAddress);
        jobId = jobIdentifier;
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    /**
     * * Create a Chainlink request to retrieve API response, find the target
     * * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function requestData(
        string memory url,
        string memory path
    ) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        // * This add the parameter to tell the oracle node about the URL to fetch the data.
        req.add("get", url);

        // * This add the path parameter to tell the oracle node about the specific data we want to get.
        req.add("path", path);

        // * Multiply the result by 1000000000000000000 to remove decimals
        int256 timesAmount = 10 ** 18;
        // * This multiples the value with the timesAmount(in order to remove the decimals we are multipling it with 1e18).
        req.addInt("times", timesAmount);

        // * Sends the request
        return sendChainlinkRequest(req, fee);
    }

    /**
     * * Receive the response in the form of uint256
     */
    function fulfill(
        bytes32 _requestId,
        uint256 _volume
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestVolume(_requestId, _volume);
        volume = _volume;
    }

    /**
     * * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
