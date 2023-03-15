import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, network } from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { ContractTransaction } from "ethers";

/**
 * * Important Notes
 *
 * * In order to run `npx hardhat deploy --typecheck` command we need to add `import hardhat-deploy` in `hardhat.config.js` file.
 *
 */

const deploySingleWordResponseContract: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    console.log(
        "\n--------------------- Deploying Single Word Response ---------------------\n"
    );
    let utf8Encode = new TextEncoder();

    const { deploy } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    const chainId = network.config.chainId!;

    const args: any[] = [
        networkConfig[chainId]["linkTokenAddress"],
        networkConfig[chainId]["oracleAddress"],
        utf8Encode.encode(networkConfig[chainId]["jobId"]),
    ];

    const singleWordResponse: DeployResult = await deploy(
        "SingleWordResponse",
        {
            from: deployer,
            log: true,
            args: args,
            waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
        }
    );
};

export default deploySingleWordResponseContract;
deploySingleWordResponseContract.tags = ["all", "single-word-response"];
