export interface networkConfigItem {
    name: string;
    ethUsdPriceFeedAddress: string;
    pORReserveFeedAddress: string;
    nftFloorPriceFeedAddress: string;
    vrfCoordinatorV2Address: string;
    subscriptionId: string;
    gasLane: string;
    callbackGasLimit: string;
    linkTokenAddress: string;
    vrfWrapperAddress: string;
    interval: number;
    oracleAddress: string;
    jobId: string;
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
    31337: {
        name: "hardhat",
        ethUsdPriceFeedAddress: "WILL MOCK IT ON TESTNETS",
        pORReserveFeedAddress: "WILL MOCK IT ON TESTNETS",
        nftFloorPriceFeedAddress: "WILL MOCK IT ON TESTNETS",
        vrfCoordinatorV2Address: "WILL MOCK IT ON TESTNETS",
        subscriptionId: "WILL CREATE DYNAMICALLY ON TESTNETS",
        gasLane:
            "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        callbackGasLimit: "500000",
        linkTokenAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        vrfWrapperAddress: "WILL MOCK IT ON TESTNETS",
        interval: 60,
        oracleAddress: "0xCC79157eb46F5624204f47AB42b3906cAA40eaB7",
        jobId: "ca98366cc7314957b8c012c72f05aeeb",
    },
    5: {
        name: "goerli",
        ethUsdPriceFeedAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        pORReserveFeedAddress: "0x3de1bE9407645533CD0CbeCf88dFE5297E7125e6",
        nftFloorPriceFeedAddress: "0x5c13b249846540F81c093Bc342b5d963a7518145",
        vrfCoordinatorV2Address: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        subscriptionId: "10473",
        gasLane:
            "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        callbackGasLimit: "500000",
        linkTokenAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        vrfWrapperAddress: "0x708701a1DfF4f478de54383E49a627eD4852C816",
        interval: 60,
        oracleAddress: "0xCC79157eb46F5624204f47AB42b3906cAA40eaB7",
        jobId: "ca98366cc7314957b8c012c72f05aeeb",
    },
    11155111: {
        name: "sepolia",
        ethUsdPriceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        pORReserveFeedAddress: "NOT SUPPORTED FOR NOW",
        nftFloorPriceFeedAddress: "NOT SUPPORTED FOR NOW",
        vrfCoordinatorV2Address: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        subscriptionId: "NOT CREATED",
        gasLane:
            "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        callbackGasLimit: "500000",
        linkTokenAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        vrfWrapperAddress: "0xab18414CD93297B0d12ac29E63Ca20f515b3DB46",
        interval: 60,
        oracleAddress: "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD",
        jobId: "ca98366cc7314957b8c012c72f05aeeb",
    },
};

export const developmentChains: string[] = ["hardhat", "localhost"];
