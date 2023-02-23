import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, network } from "hardhat";
import { developmentChains } from "../helper-hardhat-config";

/**
 * * Important Notes
 *
 * * In order to run `npx hardhat deploy --typecheck` command we need to add `import hardhat-deploy` in `hardhat.config.js` file.
 *
 */

const DECIMALS = 8;
const INITIAL_ANSWER = ethers.utils.parseEther("1700");

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deploy } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();

    const args: any[] = [DECIMALS, INITIAL_ANSWER];

    const mockV3Aggregator: DeployResult = await deploy("MockV3Aggregator", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
    });
};

export default deployMocks;
deployMocks.tags = ["all", "mocks"];
