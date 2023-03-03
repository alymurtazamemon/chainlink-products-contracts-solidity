import { ethers, getNamedAccounts } from "hardhat";
import { VRFv2Consumer } from "../typechain-types";
import { BigNumber, ContractTransaction } from "ethers";

async function requestRandomWords() {
    const { deployer } = await getNamedAccounts();

    const vrfV2ConsumerContract: VRFv2Consumer = await ethers.getContract(
        "VRFv2Consumer",
        deployer
    );

    const tx: ContractTransaction =
        await vrfV2ConsumerContract.requestRandomWords();

    await tx.wait(6);

    const requestId: BigNumber = await vrfV2ConsumerContract.getLastRequestId();
    console.log(requestId.toString());
    const [fulfilled, randomWords] =
        await vrfV2ConsumerContract.getRequestStatus(requestId);

    console.log(
        `Request Fulfilled: ${fulfilled}, Random Words: ${randomWords}`
    );
}

requestRandomWords()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
