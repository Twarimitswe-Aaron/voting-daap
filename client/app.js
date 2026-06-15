// Fix #1 + #2: Contract address and ABI are both read dynamically
// from the full Truffle build artifact (Voting.json) so they are
// always in sync with the last deployment — no manual copy-paste needed.

let contractAddress;
let contractABI;
let web3;
let votingContract;
let currentAccount;

// Fix #5: Known Ganache network IDs (wildcard "development" network)
// We warn the user if they are on a clearly wrong network (e.g. Mainnet, Sepolia).
const KNOWN_PUBLIC_NET_IDS = {
    1:        "Ethereum Mainnet",
    11155111: "Sepolia Testnet",
    5:        "Goerli Testnet",
    137:      "Polygon Mainnet",
};

async function loadABI() {
    try {
        const response = await fetch('./Voting.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const artifact = await response.json();

        // Fix #2: Support both bare array ABI and full Truffle artifact formats
        contractABI = Array.isArray(artifact) ? artifact : artifact.abi;
        if (!contractABI) throw new Error("No 'abi' field found in Voting.json");

        // Fix #1: Read the deployed address for whichever network is active
        if (!Array.isArray(artifact) && artifact.networks) {
            const netIds = Object.keys(artifact.networks);
            if (netIds.length > 0) {
                // Pick the most recently deployed network entry
                const latestNetId = netIds[netIds.length - 1];
                contractAddress = artifact.networks[latestNetId].address;
                console.log(`Using contract at ${contractAddress} (network ${latestNetId})`);
            }
        }

        if (!contractAddress) {
            throw new Error(
                "No deployed address found in Voting.json. " +
                "Make sure you have run: truffle migrate --reset"
            );
        }

        return true; // Fix #6: signal success
    } catch (err) {
        console.error("Failed to load ABI:", err);
        alert(
            "Could not load contract ABI/address.\n\n" +
            "Reason: " + err.message + "\n\n" +
            "Make sure you ran 'truffle migrate' and are serving from the client/ directory."
        );
        return false; // Fix #6: signal failure so caller can abort
    }
}

async function connectMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        alert("MetaMask not detected! Please install the MetaMask browser extension.");
        return;
    }

    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        currentAccount = accounts[0];

        // Fix #5: Warn if connected to a public/wrong network
        const netId = await web3.eth.net.getId();
        if (KNOWN_PUBLIC_NET_IDS[netId]) {
            const proceed = confirm(
                `⚠️ Warning: You are connected to ${KNOWN_PUBLIC_NET_IDS[netId]} (ID: ${netId}).\n` +
                "This DApp is intended for a local Ganache network.\n\n" +
                "Press OK to continue anyway, or Cancel to abort."
            );
            if (!proceed) return;
        }

        document.getElementById('account').innerText =
            `✅ Connected: ${currentAccount} (Network ID: ${netId})`;

        // Fix #6: abort if ABI/address loading fails
        const loaded = await loadABI();
        if (!loaded) return;

        votingContract = new web3.eth.Contract(contractABI, contractAddress);
        await loadCandidates();

        // Fix #14 equivalent for voting: refresh on account switch
        window.ethereum.on('accountsChanged', async (newAccounts) => {
            currentAccount = newAccounts[0];
            document.getElementById('account').innerText =
                `✅ Connected: ${currentAccount} (Network ID: ${netId})`;
            if (votingContract) await loadCandidates();
        });

        window.ethereum.on('chainChanged', () => {
            alert("Network changed. Reloading the page.");
            window.location.reload();
        });

    } catch (err) {
        console.error("Failed to connect MetaMask:", err);
        alert("Connection failed: " + err.message);
    }
}

async function loadCandidates() {
    // Fix #4: Guard against calling before wallet is connected
    if (!votingContract || !web3) {
        alert("Please connect MetaMask first.");
        return;
    }
    try {
        const count = await votingContract.methods.candidatesCount().call();
        const list = document.getElementById("candidates");
        list.innerHTML = "";

        if (parseInt(count) === 0) {
            list.innerHTML = "<li>No candidates found.</li>";
            return;
        }

        for (let i = 1; i <= count; i++) {
            const candidate = await votingContract.methods.candidates(i).call();
            const li = document.createElement("li");
            li.innerText = `${candidate.name} — ${candidate.voteCount} vote(s)  `;

            const btn = document.createElement("button");
            btn.innerText = "Vote";
            btn.onclick = () => vote(i);
            li.appendChild(btn);
            list.appendChild(li);
        }
    } catch (err) {
        console.error("Error loading candidates:", err);
        alert("Error loading candidates. Check the console for details.");
    }
}

async function vote(candidateId) {
    // Fix #4: Guard against calling before wallet is connected
    if (!votingContract || !currentAccount) {
        alert("Please connect MetaMask first.");
        return;
    }
    try {
        await votingContract.methods.vote(candidateId).send({ from: currentAccount });
        alert("✅ Vote successfully cast!");
        await loadCandidates();
    } catch (err) {
        console.error("Error casting vote:", err);
        // Provide a readable message for the most common revert reason
        const msg = err.message || "";
        if (msg.includes("Already voted")) {
            alert("❌ You have already voted with this account.");
        } else if (msg.includes("Invalid candidate")) {
            alert("❌ Invalid candidate ID.");
        } else {
            alert("❌ Transaction failed: " + msg);
        }
    }
}

// Fix #3: addCandidate is private in the contract — expose a clear message
function addCandidate() {
    alert(
        "ℹ️  addCandidate() is marked 'private' in the smart contract.\n\n" +
        "It can only be called internally (by the constructor).\n" +
        "To allow public addition: change 'private' → 'public' in Voting.sol, " +
        "redeploy, and implement the send() call here."
    );
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connectBtn').addEventListener('click', connectMetaMask);
    document.getElementById('addCandidateBtn').addEventListener('click', addCandidate);
});
