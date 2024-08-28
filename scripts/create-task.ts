import { deployments, ethers, w3f } from "hardhat";
import {
  AutomateSDK,
  TriggerConfig,
  TriggerType,
} from "@gelatonetwork/automate-sdk";
import { priceIds } from "../src/constants";

const main = async () => {
  const oracle = await deployments.get("L1PriceOracle");
  const oracleW3f = w3f.get("oracle");
  const oracleCid = await oracleW3f.deploy();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deployer]: any[] = await ethers.getSigners();
  const { chainId } = await ethers.provider.getNetwork();

  // required since the automate-sdk uses ethers v5
  deployer._isSigner = true;
  deployer.getChainId = () => chainId.toString();

  const trigger: TriggerConfig = {
    type: TriggerType.TIME,
    interval: 2000,
  };

  const userArgs = {
    oracleAddress: oracle.address,
    priceIds,
  };

  const automate = new AutomateSDK(Number(chainId), deployer);
  const { taskId, tx } = await automate.createBatchExecTask({
    name: "Gelato Native Oracle",
    web3FunctionHash: oracleCid,
    web3FunctionArgs: userArgs,
    trigger,
  });

  await tx.wait();

  console.log(
    `https://beta.app.gelato.network/task/${taskId}?chainId=${chainId}`
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
