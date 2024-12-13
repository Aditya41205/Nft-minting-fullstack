import React, { useState } from "react";
import { BrowserProvider, Contract } from "ethers";

const contractAddress = "0x41B6805b9e91bd46087E9bCEAA6141D16b4D567D";
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenID", "type": "uint256" }
    ],
    "name": "tokenURI",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "tokenUri", "type": "string" }
    ],
    "name": "mintnft",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function App() {
  const [wallet, setWalletAddress] = useState('');
  const [uri, setUri] = useState('');
  const [tokenid, setTokenId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed.");
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setError('');
    } catch (err) {
      setError(err.message || "An error occurred while connecting wallet.");
    }
  };

  const mintNFT = async () => {
    setError('');
    setSuccess('');
    if (!wallet) {
      setError("Please connect your wallet first.");
      return;
    }
    if (!uri) {
      setError("Please provide a valid token URI.");
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);
      const tx = await contract.mintnft(uri);
      await tx.wait(); // Wait for transaction to be mined
      setSuccess("NFT minted successfully!");
    } catch (err) {
      setError(err.message || "An error occurred while minting the NFT.");
    }
  };

  const fetchTokenURI = async () => {
    setError('');
    setSuccess('');
    if (!wallet) {
      setError("Please connect your wallet first.");
      return;
    }
    if (!tokenid) {
      setError("Please provide a valid token ID.");
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);
      const uri = await contract.tokenURI(tokenid);
      setSuccess(`Token URI: ${uri}`);
    } catch (err) {
      setError(err.message || "An error occurred while fetching the token URI.");
    }
  };

  return (
    <div>
      <h1>Basic NFT DApp</h1>
      <button onClick={connectWallet}>
        {wallet ? `Wallet: ${wallet.slice(0, 6)}...${wallet.slice(-4)}` : "Connect Wallet"}
      </button>

      <div>
        <h2>Mint NFT</h2>
        <input
          type="text"
          placeholder="Enter Token URI"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
        />
        <button onClick={mintNFT}>Mint</button>
      </div>

      <div>
        <h2>Fetch Token URI</h2>
        <input
          type="text"
          placeholder="Enter Token ID"
          value={tokenid}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <button onClick={fetchTokenURI}>Fetch URI</button>
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default App;
