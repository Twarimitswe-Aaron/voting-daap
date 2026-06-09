# Voting Smart Contract Lab-Manual DApp

## Live Deployment
🌍 **[View Live IPFS DApp on Pinata Gateway](https://blush-selected-moth-706.mypinata.cloud/ipfs/bafybeigybooulvxsjcqtcxhdm5zryy3g4rfgrtikbhvsvm2ns677rq4tdi/)**
A decentralized voting application built with Solidity, Web3.js, and Truffle.

## Project Structure
- `contracts/Voting.sol`: The Solidity smart contract.
- `migrations/2_deploy_contracts.js`: The Truffle deployment script.
- `client/app.js`: Frontend logic.
- `client/index.html`: User Interface containing the Voting DApp and Q&A section.

## Configuration & Setup

1. **Start Ganache:**
   Ensure Ganache is running locally (e.g. `ganache-cli` on port `8545`).

2. **Deploy the Smart Contract:**
   Navigate to the root of the project (`voting-dapp`) and run:
   ```bash
   npx truffle migrate
   ```
   *Take note of the deployed contract address.*

3. **Configure the Frontend:**
   Open `client/app.js` and replace `YOUR_CONTRACT_ADDRESS` on line 1 with the contract address from step 2.

4. **Run the DApp:**
   You must serve the application from the root directory so it can access the `build/contracts/Voting.json` ABI file.
   ```bash
   # From the voting-dapp directory
   npx http-server
   ```
   Open `http://127.0.0.1:8080/client/index.html` in your browser.

## Questions and Answers Highlights

### Why does the "Add Candidate" button fail?
In the provided Lab Manual code, the `addCandidate` function in `Voting.sol` is marked as **`private`**. Private functions cannot be called externally (by a user or a frontend). To fix this and make the button work, you must change `private` to `public` in the smart contract.

### Why are mappings used instead of arrays?
Mappings provide O(1) lookup time, saving significant gas costs when verifying if an address has already voted.

### Who pays for the gas fee when voting?
The account executing the `vote()` transaction pays the gas fee. Reading data (like `candidatesCount`) does not cost gas, but modifying state does.
