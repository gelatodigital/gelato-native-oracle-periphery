import { DeployFunction } from "hardhat-deploy/types";
import { AutomateSDK } from "@gelatonetwork/automate-sdk";
import { ethers, deployments, getNamedAccounts } from "hardhat";

const func: DeployFunction = async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deployer]: any[] = await ethers.getSigners();
  const { chainId } = await ethers.provider.getNetwork();

  // required since the automate-sdk uses ethers v5
  deployer._isSigner = true;
  deployer.getChainId = () => chainId.toString();

  const { pyth } = await getNamedAccounts();
  if (!pyth) throw new Error("Missing pyth address");

  const automate = new AutomateSDK(Number(chainId), deployer);
  const dedicatedMsgSender = await automate.getDedicatedMsgSender();

  await deployments.deploy("L1PriceOracle", {
    from: deployer.address,
    proxy: {
      execute: {
        init: {
          methodName: "initialize",
          args: [pyth, dedicatedMsgSender.address],
        },
      },
    },
    log: true,
  });
};

func.tags = ["L1PriceOracle"];

export default func;
