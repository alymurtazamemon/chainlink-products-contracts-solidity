export interface networkConfigItem {
    name: string;
    ethUsdPriceFeedAddress?: string;
    pORReserveFeedAddress?: string;
    nftFloorPriceFeedAddress?: string;
    vrfCoordinatorV2Address?: string;
    subscriptionId?: string;
    gasLane: string;
    callbackGasLimit: string;
    linkTokenAddress: string;
    vrfWrapperAddress?: string;
    interval: number;
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
    31337: {
        name: "hardhat",
        gasLane:
            "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        callbackGasLimit: "500000",
        linkTokenAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        interval: 60,
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
    },
};

export const developmentChains: string[] = ["hardhat", "localhost"];
