import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, network } from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { VRFCoordinatorV2Mock } from "../typechain-types";
import { ContractTransaction } from "ethers";

/**
 * * Important Notes
 *
 * * In order to run `npx hardhat deploy --typecheck` command we need to add `import hardhat-deploy` in `hardhat.config.js` file.
 *
 */

const deployVRFV2DirectFundingConsumer: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { deploy } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    const chainId = network.config.chainId!;

    let vrfWrapperAddress;

    if (chainId == 31337) {
        const vrfV2WrapperContract = await ethers.getContract(
            "VRFV2Wrapper",
            deployer
        );
        vrfWrapperAddress = vrfV2WrapperContract.address;
    } else {
        vrfWrapperAddress = networkConfig[chainId]["vrfWrapperAddress"];
    }

    const args: any[] = [
        networkConfig[chainId]["linkTokenAddress"],
        vrfWrapperAddress,
        networkConfig[chainId]["callbackGasLimit"],
    ];

    const vrfV2DirectFundingConsumer: DeployResult = await deploy(
        "VRFv2DirectFundingConsumer",
        {
            from: deployer,
            log: true,
            args: args,
            waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
        }
    );
};

export default deployVRFV2DirectFundingConsumer;
deployVRFV2DirectFundingConsumer.tags = [
    "all",
    "vrf-v2-direct-funding-consumer",
];
