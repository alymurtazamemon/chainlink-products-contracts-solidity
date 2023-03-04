import { ethers, getNamedAccounts, network } from "hardhat";
import { VRFCoordinatorV2Mock, VRFv2Consumer } from "../typechain-types";
import { BigNumber, ContractTransaction } from "ethers";

async function requestRandomWords() {
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    const vrfV2ConsumerContract: VRFv2Consumer = await ethers.getContract(
        "VRFv2Consumer",
        deployer
    );

    if (chainId == 31337) {
        const vrfCoordinatorV2Mock: VRFCoordinatorV2Mock =
            await ethers.getContract("VRFCoordinatorV2Mock", deployer);

        await new Promise(async (resolve, reject) => {
            vrfV2ConsumerContract.on("RequestFulfilled", async () => {
                try {
                    const requestId: BigNumber =
                        await vrfV2ConsumerContract.getLastRequestId();
                    console.log(`Request ID: ${requestId.toString()}`);

                    const [fulfilled, randomWords] =
                        await vrfV2ConsumerContract.getRequestStatus(requestId);

                    console.log(
                        `Request Fulfilled: ${fulfilled}, Random Words: ${randomWords}`
                    );

                    resolve("Success");
                } catch (error) {
                    reject(error);
                }
            });

            const tx: ContractTransaction =
                await vrfV2ConsumerContract.requestRandomWords();
            await tx.wait(1);

            const requestId: BigNumber =
                await vrfV2ConsumerContract.getLastRequestId();
            console.log(`Request ID: ${requestId.toString()}`);

            await vrfCoordinatorV2Mock.fulfillRandomWords(
                requestId,
                vrfV2ConsumerContract.address
            );
        });
    } else {
        const tx: ContractTransaction =
            await vrfV2ConsumerContract.requestRandomWords();

        await tx.wait(6);

        const requestId: BigNumber =
            await vrfV2ConsumerContract.getLastRequestId();
        console.log(requestId.toString());

        const [fulfilled, randomWords] =
            await vrfV2ConsumerContract.getRequestStatus(requestId);

        console.log(
            `Request Fulfilled: ${fulfilled}, Random Words: ${randomWords}`
        );
    }
}

requestRandomWords()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
