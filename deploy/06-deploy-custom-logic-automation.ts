import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, network } from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { ContractTransaction } from "ethers";
import { CustomLogicAutomation } from "../typechain-types";

/**
 * * Important Notes
 *
 * * In order to run `npx hardhat deploy --typecheck` command we need to add `import hardhat-deploy` in `hardhat.config.js` file.
 *
 */

const deployCustomLogicAutomationContract: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    console.log(
        "\n--------------------- Deploying Custom Logic Automation ---------------------\n"
    );
    const { deploy } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    const chainId = network.config.chainId!;

    const args: any[] = [networkConfig[chainId]["interval"]];

    const customLogicAutomation: DeployResult = await deploy(
        "CustomLogicAutomation",
        {
            from: deployer,
            log: true,
            args: args,
            waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
        }
    );

    if (chainId == 31337) {
        const customLogicAutomationContract: CustomLogicAutomation =
            await ethers.getContract("CustomLogicAutomation", deployer);

        const signers = await ethers.getSigners();

        const currentCounterValue =
            await customLogicAutomationContract.counter();

        console.log(`Current counter value is: ${currentCounterValue}`);

        const interval = await customLogicAutomationContract.interval();
        await network.provider.send("evm_increaseTime", [
            interval.toNumber() + 1,
        ]);
        await network.provider.request({ method: "evm_mine", params: [] });

        const [upkeepNeeded, performData] =
            await customLogicAutomationContract.checkUpkeep("0x");

        if (upkeepNeeded) {
            const tx: ContractTransaction =
                await customLogicAutomationContract.performUpkeep("0x");

            await tx.wait(1);

            const updateCounterValue =
                await customLogicAutomationContract.counter();

            console.log(`Updated counter value is: ${updateCounterValue}`);
        }
    }
};

export default deployCustomLogicAutomationContract;
deployCustomLogicAutomationContract.tags = ["all", "custom-logic-automation"];
