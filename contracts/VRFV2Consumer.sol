// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract VRFv2Consumer is VRFConsumerBaseV2, ConfirmedOwner {
    VRFCoordinatorV2Interface private s_vrfCoordinatorV2;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    uint32 private s_callbackGasLimit;
    uint64 private s_subscriptionId;
    uint256[] private s_requestIds;
    uint256 private s_lastRequestId;

    bytes32 private s_gasLane;

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }

    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */

    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    /**
     * Network: Ethereum Goerli
     * VRF Coordinator: 0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D
     */
    constructor(
        address vrfCoordinatorV2Address,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        bytes32 gasLane
    ) VRFConsumerBaseV2(vrfCoordinatorV2Address) ConfirmedOwner(msg.sender) {
        s_vrfCoordinatorV2 = VRFCoordinatorV2Interface(vrfCoordinatorV2Address);
        s_subscriptionId = subscriptionId;
        s_callbackGasLimit = callbackGasLimit;
        s_gasLane = gasLane;
    }

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords()
        external
        onlyOwner
        returns (uint256 requestId)
    {
        // Will revert if subscription is not set and funded.
        requestId = s_vrfCoordinatorV2.requestRandomWords(
            s_gasLane,
            s_subscriptionId,
            REQUEST_CONFIRMATIONS,
            s_callbackGasLimit,
            NUM_WORDS
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        s_requestIds.push(requestId);
        s_lastRequestId = requestId;
        emit RequestSent(requestId, NUM_WORDS);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(_requestId, _randomWords);
    }

    function updateVRFV2CoordinatorAddress(
        address newVRFV2CoordinatorAddress
    ) external {
        s_vrfCoordinatorV2 = VRFCoordinatorV2Interface(
            newVRFV2CoordinatorAddress
        );
    }

    function updateSubscriptionId(uint64 newSubscriptionId) external {
        s_subscriptionId = newSubscriptionId;
    }

    function update(uint32 newCallbackGasLimit) external {
        s_callbackGasLimit = newCallbackGasLimit;
    }

    function update(bytes32 newGasLane) external {
        s_gasLane = newGasLane;
    }

    // * View & Pure functions

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    function getVRFCoordinatorV2Address() external view returns (address) {
        return address(s_vrfCoordinatorV2);
    }

    function getCallbackGasLimit() external view returns (uint256) {
        return s_callbackGasLimit;
    }

    function getRequestIds() external view returns (uint256[] memory) {
        return s_requestIds;
    }

    function getLastRequestId() external view returns (uint256) {
        return s_lastRequestId;
    }

    function getNumWords() external pure returns (uint256) {
        return NUM_WORDS;
    }

    function getRequiredConfirmations() external pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }
}
