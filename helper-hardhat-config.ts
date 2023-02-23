export interface networkConfigItem {
    ethUsdPriceFeedAddress?: string;
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
    31337: {},
    5: {
        ethUsdPriceFeedAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
};

export const developmentChains: string[] = ["hardhat", "localhost"];
