## Deployment

1. Install dependencies
   ```
   yarn install
   ```
3. Edit ``.env``
   ```
   cp .env.example .env
   ```
4. Specify additional price feeds (Optional)
   ```
   vim src/constants/index.ts
   ```
4. Deploy contracts
   ```
   yarn hardhat deploy --network baseSepolia
   ```
5. Create Web3Function task
   ```
   yarn hardhat run scripts/create-task.ts --network baseSepolia
   ```
6. Verify contracts on Etherscan (Optional)
   ```
   yarn hardhat etherscan-verify --network baseSepolia
   ```
6. Deposit ``SEP`` into ``L1PriceOracle`` contract for Pyth `updateFee` payment
