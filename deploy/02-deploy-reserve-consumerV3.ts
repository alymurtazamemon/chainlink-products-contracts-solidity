import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, network } from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { ReserveConsumerV3 } from "../typechain-types";

/**
 * * Important Notes
 *
 * * In order to run `npx hardhat deploy --typecheck` command we need to add `import hardhat-deploy` in `hardhat.config.js` file.
 *
 */

const deployReserveConsumerV3: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    console.log(
        "\n--------------------- Deploying Reserve Consumer V3 ---------------------\n"
    );
    const { deploy } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    const chainId = network.config.chainId!;
    let pORReserveFeedAddress;

    if (chainId == 31337) {
        const mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        );
        pORReserveFeedAddress = mockV3Aggregator.address;
    } else {
        pORReserveFeedAddress = networkConfig[chainId]["pORReserveFeedAddress"];
    }

    const args: any[] = [pORReserveFeedAddress];

    const reserveConsumerV3: DeployResult = await deploy("ReserveConsumerV3", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
    });

    if (chainId == 31337) {
        const reserveConsumerV3Contract: ReserveConsumerV3 =
            await ethers.getContractAt(
                "ReserveConsumerV3",
                reserveConsumerV3.address
            );

        const latestReserve =
            await reserveConsumerV3Contract.getLatestReserve();

        console.log(`Latest Reserve of Stader Labs PoR is: ${latestReserve}`);
    }
};

export default deployReserveConsumerV3;
deployReserveConsumerV3.tags = ["all", "reserve-consumer-v3"];
