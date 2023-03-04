import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, network } from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { PriceConsumerV3 } from "../typechain-types";

/**
 * * Important Notes
 *
 * * In order to run `npx hardhat deploy --typecheck` command we need to add `import hardhat-deploy` in `hardhat.config.js` file.
 *
 */

const deployPriceConsumerV3: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { deploy } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    const chainId = network.config.chainId!;
    let ethUsdPriceFeedAddress;

    if (chainId == 31337) {
        const mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        );
        ethUsdPriceFeedAddress = mockV3Aggregator.address;
    } else {
        ethUsdPriceFeedAddress =
            networkConfig[chainId]["ethUsdPriceFeedAddress"];
    }

    const args: any[] = [ethUsdPriceFeedAddress];

    const priceConsumerV3: DeployResult = await deploy("PriceConsumerV3", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
    });

    if (chainId == 31337) {
        const priceConsumerV3Contract: PriceConsumerV3 =
            await ethers.getContractAt(
                "PriceConsumerV3",
                priceConsumerV3.address
            );

        const [latestPrice, latestRoundId] =
            await priceConsumerV3Contract.getLatestPrice();

        console.log(`Latest ETH/USD Price is: ${latestPrice}`);
        console.log(`Latest Round ID is: ${latestRoundId}`);

        // * First parse to BigInt to perform computation with big integers
        const num = BigInt(latestRoundId.toString());
        const num2 = BigInt("0xFFFFFFFFFFFFFFFF"); // * Largest 64bits integer

        const phaseId = Number(num >> 64n); // * returns (phaseId)
        const currentAggregatorRoundId = Number(num & num2); // * returns (aggregatorRoundId) . Use & (AND bitwise operator) which sets each bit to _1_ if both bits are _1_

        console.log(`Phase ID is: ${phaseId}`);
        console.log(
            `Current Aggregator Round ID is: ${currentAggregatorRoundId}`
        );

        const firstRoundId = latestRoundId.sub(currentAggregatorRoundId).add(1);

        console.log(`First Round ID is: ${firstRoundId}`);

        for (
            let i = currentAggregatorRoundId;
            i >= firstRoundId.toNumber();
            i--
        ) {
            const historicalPrice =
                await priceConsumerV3Contract.getHistoricalPrice(i);
            console.log(`Historical Price is: ${historicalPrice}`);
        }
    }
};

export default deployPriceConsumerV3;
deployPriceConsumerV3.tags = ["all", "price-consumer-v3"];
