import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, network } from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";

/**
 * * Important Notes
 *
 * * In order to run `npx hardhat deploy --typecheck` command we need to add `import hardhat-deploy` in `hardhat.config.js` file.
 *
 */

// * MockV3Aggregator - Constructor Values
const DECIMALS = 8;
const INITIAL_ANSWER = ethers.utils.parseEther("1700"); // 1700 ETH

// * VRFCoordinatorV2Mock - Constructor Values
const BASE_FEE = "250000000000000000"; // 0.25 LINK;
const GAS_PRICE_LINK = 1e9; // 0.000000001 LINK per gas

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    console.log(
        "\n--------------------- Deploying Mocks ---------------------\n"
    );
    const { deploy } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    const chainId = network.config.chainId!;

    if (chainId == 31337) {
        const mockV3Aggregator = await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
            waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
        });

        const vrfCoordinatorV2Mock = await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
            waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
        });

        await deploy("VRFV2Wrapper", {
            from: deployer,
            log: true,
            args: [
                networkConfig[chainId]["linkTokenAddress"],
                mockV3Aggregator.address,
                vrfCoordinatorV2Mock.address,
            ],
            waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
        });
    }
};

export default deployMocks;
deployMocks.tags = ["all", "mocks"];
