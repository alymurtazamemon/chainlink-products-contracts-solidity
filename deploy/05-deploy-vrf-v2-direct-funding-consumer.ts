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
const FUND_AMOUNT = ethers.utils.parseEther("10");

const deployVRFV2DirectFundingConsumer: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    console.log(
        "\n--------------------- Deploying VRF V2 Direct Funding Consumer ---------------------\n"
    );
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

    if (chainId == 31337) {
        const vrfV2DirectFundingConsumerContract = await ethers.getContract(
            "VRFv2DirectFundingConsumer",
            deployer
        );

        const signers = await ethers.getSigners();

        console.log(`Funding the contract...`);
        await signers[0].sendTransaction({
            to: vrfV2DirectFundingConsumerContract.address,
            value: FUND_AMOUNT,
        });
        console.log(`Funded the contract.`);

        console.log(
            `Current Balance of VRFv2DirectFundingConsumer Contract is: ${await ethers.provider.getBalance(
                vrfV2DirectFundingConsumer.address
            )}`
        );
    }
};

export default deployVRFV2DirectFundingConsumer;
deployVRFV2DirectFundingConsumer.tags = [
    "all",
    "vrf-v2-direct-funding-consumer",
];
