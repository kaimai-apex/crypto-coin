# Kaimai Token (KAIMAI)

An ERC-20 token built on Ethereum with advanced features including minting, burning, and pausing capabilities.

## Features

- Initial Supply: 1,000,000 KAIMAI
- Maximum Supply: 10,000,000 KAIMAI
- Minting (Owner only)
- Burning (Any holder)
- Pausable transfers
- ERC-20 compliant

## Smart Contract Details

The contract is built using:
- Solidity 0.8.20
- OpenZeppelin contracts
- Hardhat development environment

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- MetaMask wallet
- Sepolia testnet ETH

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kaimai-apex/crypto-coin.git
cd crypto-coin
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
SEPOLIA_RPC_URL="your_rpc_url"
PRIVATE_KEY="your_private_key"
ETHERSCAN_API_KEY="your_etherscan_api_key"
```

### Testing

Run the test suite:
```bash
npx hardhat test
```

### Deployment

Deploy to Sepolia testnet:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Contract Address

[Add your deployed contract address here]

## License

MIT

## Author

Kaimai 