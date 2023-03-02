export interface networkConfigItem {
    ethUsdPriceFeedAddress?: string;
    pORReserveFeedAddress?: string;
    nftFloorPriceFeedAddress?: string;
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
    31337: {},
    5: {
        ethUsdPriceFeedAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        pORReserveFeedAddress: "0x3de1bE9407645533CD0CbeCf88dFE5297E7125e6",
        nftFloorPriceFeedAddress: "0x5c13b249846540F81c093Bc342b5d963a7518145",
    },
};

export const developmentChains: string[] = ["hardhat", "localhost"];
