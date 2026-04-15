# Stellar Payment Tracker — Level 2 (Green Belt)

A multi-wallet payment tracking dApp built on the Stellar Testnet with Soroban smart contract integration and real-time transaction monitoring.

---

## Features

- **Multi-Wallet Support:** Connect via Freighter or xBull wallets through a unified wallet abstraction (StellarWalletsKit pattern).
- **Smart Contract Integration:** Records payments on a Soroban smart contract deployed to testnet, enabling on-chain payment history.
- **Multi-Address Payments:** Send XLM to multiple recipients in a single session with per-recipient memo support.
- **Real-Time Sync:** Auto-polls contract state and Horizon API every 15 seconds for live payment and transaction updates.
- **Transaction Status Timeline:** Visual step-by-step tracking: Building → Signing → Submitting → Confirming → Success/Failed.
- **Comprehensive Error Handling:** 5 distinct error types with user-friendly messages:
  1. **Wallet Not Found** — extension not installed or unavailable
  2. **Transaction Rejected** — user declined signing in wallet
  3. **Insufficient Balance** — amount exceeds available XLM (minus reserve)
  4. **Invalid Address** — destination fails Stellar public key validation
  5. **Contract Error** — Soroban invocation failure

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- [Freighter](https://www.freighter.app/) or [xBull](https://xbull.app/) browser extension configured for testnet
- Testnet XLM from [Friendbot](https://laboratory.stellar.org/#account-creator?network=test)

### Local Setup

```bash
# Clone the repository
git clone https://github.com/Harsheyz/Stellar-connect-wallet-challenge.git
cd Stellar-connect-wallet-challenge/stellar-connect-wallet

# Install dependencies
npm install

# Start the development server
npm start
```

The app will be available at `http://localhost:3000`.

---

## Smart Contract

### Contract Overview

The Payment Tracker smart contract (Soroban/Rust) provides:

| Function | Description |
|---|---|
| `record_payment(sender, recipient, amount, memo)` | Records a payment on-chain with auto-incrementing ID |
| `get_payment(payment_id)` | Reads a single payment record |
| `get_payment_count()` | Returns total number of recorded payments |
| `get_payments_by_sender(sender)` | Returns all payment IDs for a sender |

Contract source code: [`contracts/payment-tracker/src/lib.rs`](./contracts/payment-tracker/src/lib.rs)

### Deploying the Contract

Requires [Rust](https://rustup.rs/) and [Stellar CLI](https://github.com/stellar/stellar-cli):

```bash
# Install Rust + Wasm target
rustup target add wasm32-unknown-unknown

# Install Stellar CLI
cargo install --locked stellar-cli

# Generate a funded testnet identity
stellar keys generate deployer --network testnet --fund

# Build the contract
cd contracts/payment-tracker
stellar contract build

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/payment_tracker.wasm \
  --source deployer \
  --network testnet

# Copy the returned Contract ID into src/constants.js
```

> **Note:** The frontend includes a local fallback mode that works without a deployed contract for demo/development purposes.

---

## Usage Guide

1. **Connect Wallet:** Click "Connect Wallet" → Select Freighter or xBull from the modal.
2. **Send Payments:** Enter one or more destination addresses with amounts and optional memos.
3. **Track Status:** Watch the transaction timeline animate through each stage.
4. **Record on Contract:** Toggle "Record on Smart Contract" to persist payment data on-chain.
5. **View History:** Switch between "Contract Log" (on-chain records) and "Tx History" (Horizon data) tabs.

---

## Project Structure

```
Stellar-connect-wallet-challenge/
├── contracts/
│   └── payment-tracker/
│       ├── Cargo.toml                # Soroban contract config
│       └── src/lib.rs                # Payment tracker contract (Rust)
├── stellar-connect-wallet/
│   ├── src/
│   │   ├── App.js                    # Payment Tracker dashboard
│   │   ├── App.css                   # Premium glassmorphism styles
│   │   ├── walletKit.js              # Multi-wallet abstraction layer
│   │   ├── contractClient.js         # Soroban RPC + Horizon client
│   │   ├── constants.js              # Network config, error types
│   │   ├── index.js                  # React entry point
│   │   └── index.css                 # Global styles + fonts
│   ├── config-overrides.js           # CRA webpack polyfills
│   ├── package.json                  # Dependencies + scripts
│   └── tailwind.config.js            # Tailwind CSS config
└── README.md                         # This file
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Styling | Tailwind CSS + Vanilla CSS |
| Smart Contracts | Soroban (Rust) |
| Wallet Integration | StellarWalletsKit pattern (Freighter + xBull) |
| Network Interface | `@stellar/stellar-sdk` (Horizon + Soroban RPC) |
| Wallet API | `@stellar/freighter-api` |
| Build Tool | CRA + react-app-rewired |

---

## Network Configuration

- **Network:** Stellar Testnet
- **Horizon URL:** `https://horizon-testnet.stellar.org`
- **Soroban RPC:** `https://soroban-testnet.stellar.org`
- **Passphrase:** `Test SDF Network ; September 2015`

---

## Error Handling Matrix

| Error Type | Trigger | UI Response |
|---|---|---|
| `WALLET_NOT_FOUND` | Extension not installed | Red toast with install link |
| `TX_REJECTED` | User declined signing | Red toast with rejection info |
| `INSUFFICIENT_BALANCE` | Amount > balance - 1 XLM | Warning toast |
| `INVALID_ADDRESS` | Invalid G... address format | Warning toast per recipient |
| `CONTRACT_ERROR` | Soroban call failure | Red toast with contract error |

---

## License

This project is licensed under the MIT License.
