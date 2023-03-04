import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, network } from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { NFTFloorPriceConsumerV3 } from "../typechain-types";

/**
 * * Important Notes
 *
 * * In order to run `npx hardhat deploy --typecheck` command we need to add `import hardhat-deploy` in `hardhat.config.js` file.
 *
 */

const deployNFTFloorPriceConsumerV3: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { deploy } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    const chainId = network.config.chainId!;

    let nftFloorPriceFeedAddress;

    if (chainId == 31337) {
        const mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        );
        nftFloorPriceFeedAddress = mockV3Aggregator.address;
    } else {
        nftFloorPriceFeedAddress =
            networkConfig[chainId]["nftFloorPriceFeedAddress"];
    }

    const args: any[] = [nftFloorPriceFeedAddress];

    const nftFloorPriceConsumerV3: DeployResult = await deploy(
        "NFTFloorPriceConsumerV3",
        {
            from: deployer,
            log: true,
            args: args,
            waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
        }
    );

    if (chainId == 31337) {
        const nftFloorPriceConsumerV3Contract: NFTFloorPriceConsumerV3 =
            await ethers.getContractAt(
                "NFTFloorPriceConsumerV3",
                nftFloorPriceConsumerV3.address
            );

        const latestFloorPrice =
            await nftFloorPriceConsumerV3Contract.getLatestPrice();

        console.log(
            `Latest Floor Price of CryptoPunks Collection is: ${latestFloorPrice}`
        );
    }
};

export default deployNFTFloorPriceConsumerV3;
deployNFTFloorPriceConsumerV3.tags = ["all", "nft-floor-price-consumer-v3"];
