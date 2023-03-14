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

const FUND_AMOUNT = ethers.utils.parseEther("1");

const deployVRFV2Consumer: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    console.log(
        "\n--------------------- Deploying VRF V2 Consumer ---------------------\n"
    );
    const { deploy } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    const chainId = network.config.chainId!;

    let vrfCoordinatorV2Address, subscriptionId;
    let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock;

    if (chainId == 31337) {
        vrfCoordinatorV2Mock = await ethers.getContract(
            "VRFCoordinatorV2Mock",
            deployer
        );

        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;

        // * create subscription on hardhat network.
        const txResponse: ContractTransaction =
            await vrfCoordinatorV2Mock.createSubscription();

        const txReceipt = await txResponse.wait(1);

        subscriptionId = txReceipt.events![0].args!.subId;

        // * fund subscription on hardhat network.
        await vrfCoordinatorV2Mock.fundSubscription(
            subscriptionId,
            FUND_AMOUNT
        );
    } else {
        vrfCoordinatorV2Address =
            networkConfig[chainId]["vrfCoordinatorV2Address"];
        subscriptionId = networkConfig[chainId]["subscriptionId"];
    }

    const args: any[] = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]["callbackGasLimit"],
        networkConfig[chainId]["gasLane"],
    ];

    const vrfV2Consumer: DeployResult = await deploy("VRFv2Consumer", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
    });

    if (chainId == 31337) {
        // * add consumer on hardhat network.
        await vrfCoordinatorV2Mock!.addConsumer(
            subscriptionId,
            vrfV2Consumer.address
        );
    }
};

export default deployVRFV2Consumer;
deployVRFV2Consumer.tags = ["all", "vrf-v2-consumer"];
