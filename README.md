# Kaimai Token (KAIMAI)

An ERC-20 token built on Ethereum with advanced features including minting, burning, and pausing capabilities. This project demonstrates the creation of a custom cryptocurrency with comprehensive security features and testing.

## Features

- Initial Supply: 1,000,000 KAIMAI
- Maximum Supply: 10,000,000 KAIMAI
- Minting (Owner only)
- Burning (Any holder)
- Pausable transfers
- ERC-20 compliant
- Comprehensive test coverage
- Automated CI/CD pipeline

## Smart Contract Details

### Technical Stack
- Solidity 0.8.20
- OpenZeppelin contracts v4.9.0
- Hardhat development environment
- Ethers.js for blockchain interaction
- Chai for testing

### Contract Architecture
```solidity
contract KaimaiToken is ERC20, Ownable, Pausable {
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18;
    uint256 public constant MAX_SUPPLY = 10000000 * 10**18;
    uint256 private _totalMinted;

    event TokensBurned(address indexed burner, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);
}
```

### Security Features
- Access control for minting
- Emergency pause functionality
- Supply cap enforcement
- Standard ERC-20 security features
- Comprehensive test coverage

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MetaMask wallet
- Sepolia testnet ETH
- Git

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

### Development

1. Compile the contracts:
```bash
npx hardhat compile
```

2. Run the test suite:
```bash
npx hardhat test
```

3. Run tests with coverage:
```bash
npx hardhat coverage
```

### Deployment

1. Deploy to Sepolia testnet:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

2. Verify the contract on Etherscan:
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Testing

The project includes comprehensive tests covering:
- Deployment verification
- Token transfers
- Minting functionality
- Burning functionality
- Pause mechanism
- Event emissions
- Edge cases

Run specific test suites:
```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/KaimaiToken.test.js

# Run with gas reporting
npx hardhat test --gas
```

## CI/CD Pipeline

The project uses GitHub Actions for:
- Automated testing on pull requests
- Contract compilation verification
- Test coverage reporting
- Security scanning

## Security Considerations

1. **Access Control**
   - Only owner can mint tokens
   - Only owner can pause/unpause
   - Supply cap enforcement

2. **Emergency Controls**
   - Pause functionality
   - Supply limits
   - Transfer restrictions

3. **Best Practices**
   - OpenZeppelin audited contracts
   - Comprehensive testing
   - Gas optimization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Kaimai

## Acknowledgments

- OpenZeppelin for the secure contract templates
- Hardhat team for the development environment
- Ethereum community for the ERC-20 standard 