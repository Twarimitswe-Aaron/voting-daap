# Voting Smart Contract: Complete Q&A

This document provides concise answers to all 40 questions listed in the Voting Smart Contract Lab Manual.

## 13. Important Questions for Students

1. **What is a smart contract, and how does it function in the context of Ethereum?**
   Self-executing code deployed on the Ethereum blockchain that enforces rules programmatically without a central authority.

2. **Explain the purpose of the struct Candidate in the Voting contract.**
   It groups related data (`id`, `name`, `voteCount`) into a single custom data type, making the code cleaner and easier to manage.

3. **How do mappings work in Solidity, and why are they used instead of arrays for storing voters and candidates?**
   Mappings are key-value stores providing O(1) constant-time lookup. They save significant gas compared to looping through arrays.

4. **What is the role of the constructor function in this contract? Can you add more functionality to it?**
   It runs exactly once upon deployment to initialize default data (the 3 candidates). Yes, you could add an `admin = msg.sender` here to establish ownership.

5. **What does the require statement do in Solidity, and why is it important for security in the vote function?**
   It evaluates a condition and reverts the transaction if false. It ensures users haven't voted twice and that they vote for a valid candidate.

6. **Why can’t a user vote more than once? Explain how this behavior is enforced in the contract.**
   The `voters[msg.sender]` mapping tracks if an address has voted. The `require(!voters[msg.sender])` line stops the transaction if they are already recorded.

7. **What is the purpose of the event votedEvent and how can it be used in a frontend application?**
   It logs the vote on the blockchain. The frontend can "listen" to this event to dynamically update the UI without the user refreshing the page.

8. **Explain what happens when you run truffle migrate. What is the role of the migration script?**
   It packages and deploys the compiled smart contracts to the specified blockchain network according to instructions in the migration script.

9. **How does the app.js file interact with the deployed smart contract? Mention the key libraries and methods involved.**
   It uses the `Web3.js` library to connect to MetaMask, load the contract's ABI, and create a `web3.eth.Contract` object to execute `call()` and `send()` methods.

10. **What is the significance of the web3.eth.Contract object in interacting with a deployed contract from the frontend?**
    It acts as a JavaScript wrapper, translating standard JS method calls into complex Ethereum RPC calls.

11. **In the index.html file, why is the Web3.js library loaded via CDN? What would happen if it were not included?**
    It provides the tools to interact with the blockchain. Without it, `new Web3()` would fail, and the DApp wouldn't connect.

12. **How does MetaMask integrate with the dApp, and what specific permission must the user grant before any interaction can occur?**
    MetaMask injects `window.ethereum` into the browser. The user must grant permission via `eth_requestAccounts` to allow the DApp to view their wallet address.

13. **What is the difference between view and pure functions in Solidity, and why are they important for gas optimization?**
    `view` reads state but doesn't alter it, `pure` neither reads nor modifies state. Both cost zero gas when called externally.

14. **Explain how you could extend this voting system to allow dynamic addition of candidates by users. What changes would you make?**
    Change `addCandidate` from `private` to `public`. In the frontend, implement the `addCandidate` JS function to send a transaction with the input name.

15. **What are some potential security issues or limitations of this simple voting contract? How would you improve it?**
    It lacks Sybil resistance (one person can make 100 free wallets in Ganache). To improve, add an admin whitelist that explicitly approves voter addresses.

16. **How does the frontend update the list of candidates after a vote is cast? Describe the flow from blockchain to UI.**
    After a successful vote transaction, `app.js` calls `loadCandidates()`, which fetches the updated vote counts and rewrites the HTML DOM elements dynamically.

17. **What is the purpose of the voters mapping being declared as public?**
    Solidity automatically creates a getter function, allowing anyone (or the frontend) to easily check if a specific address has voted.

18. **What does the emit keyword do in Solidity, and how is it used in this contract?**
    It triggers an event, writing data to the transaction receipt logs (e.g., `emit votedEvent(_candidateId)`).

19. **Explain how gas fees are calculated for transactions like voting in this contract. Who pays the gas fee and why?**
    Gas is calculated based on computational complexity. The voter pays it because they are the ones modifying the blockchain state.

20. **How would you modify this contract to support multiple elections or categories of votes?**
    Create an `Election` struct containing its own candidates and voters mappings, tracked by a unique `electionId`.

---

## 14. Important Questions from the Code

1. **What does the addCandidate function do, and why is it marked as private?**
   It adds a candidate to the internal mapping. Marked `private` so only the contract itself (specifically the constructor) can call it.

2. **Why is the voters mapping declared as public, and what does that imply about its accessibility?**
   It allows external apps or users to read the mapping directly without needing a custom-written getter function.

3. **Explain the purpose of the require statements inside the vote function. What happens if one of them fails?**
   They enforce voting rules. If one fails, execution stops immediately, state changes revert, and gas is consumed up to that failure point.

4. **What is the significance of the emit votedEvent(...) line in the vote function? How can this be used in the frontend?**
   It signals a successful state change. The frontend can subscribe to it to show real-time notifications to users.

5. **How does the contract prevent duplicate voting by the same Ethereum address?**
   By setting `voters[msg.sender] = true` and checking it with a `require` statement on all subsequent attempts.

6. **In the app.js file, what is the role of the loadABI() function, and why is it necessary?**
   It fetches the contract's ABI JSON. The ABI is strictly required so Web3 knows what functions exist and how to format data for the EVM.

7. **What is the purpose of the web3.eth.Contract object in app.js? What two pieces of information does it require?**
   To create an interface to the contract. It requires the contract's ABI and the deployed Contract Address.

8. **Why is the async/await pattern used in functions like connectMetaMask() and vote()? What would happen without it?**
   Blockchain interactions are network requests that take time. Without it, the code would execute out of order before the blockchain responds, causing errors.

9. **In the index.html file, why is the Web3.js library included via a CDN link? What would happen if this script tag was removed?**
   It imports the Web3 package remotely. Removing it would cause a "Web3 is not defined" error in `app.js`.

10. **The loadCandidates() function fetches candidate data from the contract. How is the DOM updated dynamically with this data?**
    It clears the existing `ul` list, loops through candidates, creates new `li` and `button` elements in JavaScript, and appends them to the DOM.

11. **What is the purpose of the event votedEvent in the Solidity contract, and how could you listen for it in the frontend?**
    It logs votes. You listen using `contract.events.votedEvent({}).on('data', (event) => { /* update UI */ })`.

12. **In the Truffle migration script, what does the artifacts.require("Voting") statement do?**
    It loads the compiled JSON artifact containing the ABI and bytecode necessary to deploy the contract.

13. **What is the significance of the indexed keyword in the votedEvent(uint indexed candidateId) declaration?**
    It allows frontend applications to filter logs by `candidateId` quickly without downloading every single event on the blockchain.

14. **In the truffle-config.js file, what does the networks.development configuration specify, and why is it important?**
    It tells Truffle where to deploy the contract locally (host and port), ensuring it connects to Ganache instead of the Ethereum Mainnet.

15. **The constructor function calls addCandidate three times. How would you modify this to allow dynamic addition of candidates after deployment?**
    Remove them from the constructor, change `addCandidate` to `public`, and ideally restrict it using `require(msg.sender == admin)`.

16. **In JavaScript, explain the difference between const, let, and var. Give an example of where each might be appropriately used in app.js.**
    `const` is for constants (`contractAddress`), `let` is for variables that change (`web3`), `var` is function-scoped (legacy, should be avoided).

17. **What does the fetch('/build/contracts/Voting.json') call retrieve, and why is it needed?**
    It retrieves the ABI. It's needed to encode function calls correctly for the EVM.

18. **In the vote() function of app.js, what does the send({ from: account }) method do, and who pays for the transaction?**
    It signs and broadcasts the transaction. The `account` specifies who sends it, and that account pays the gas fee.

19. **What is the purpose of the mapping(address => bool) public voters; in the Solidity contract?**
    It creates a registry of addresses. It enforces business logic by ensuring one-vote-per-person limits.

20. **If a user tries to vote for a candidate ID that doesn't exist, what will happen?**
    The second `require` statement checks `_candidateId <= candidatesCount`. It will fail and revert the transaction with the error "Invalid candidate".
