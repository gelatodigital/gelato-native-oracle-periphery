import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import { L1PriceOracle__factory } from "../../typechain";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const pyth = new EvmPriceServiceConnection("https://hermes.pyth.network");
  const priceIds = context.userArgs.priceIds as string[];
  const updateData = await pyth.getPriceFeedsUpdateData(priceIds);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const IL1PriceOracle = L1PriceOracle__factory.createInterface();
  const updatePrice = IL1PriceOracle.encodeFunctionData("updatePrices", [
    priceIds,
    updateData,
  ]);

  return {
    canExec: true,
    callData: [
      {
        to: context.userArgs.oracleAddress as string,
        data: updatePrice,
      },
    ],
  };
});
