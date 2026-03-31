# Stellar Connect Wallet Challenge

A clean, responsive React-based decentralized application built to interact with the Stellar Testnet. This project allows users to connect their Freighter wallet, check their native XLM balance, and execute testnet transactions securely.

---

## Features

- **Freighter Integration:** Secure connection handling with support for dynamic account switching.
- **Real-Time Data:** Queries the Stellar Testnet Horizon API to display the active XLM balance of the connected account.
- **Native Payments:** Facilitates sending XLM to any valid Stellar public address, handling the complete transaction lifecycle from building to signing and submission.
- **No Persistence:** Built with privacy in mind. No private keys are stored locally; all signing is entirely delegated to the Freighter extension.

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- The [Freighter Browser Extension](https://www.freighter.app/) installed and configured for the Stellar Testnet.
- Testnet XLM (which can be acquired from the [Friendbot](https://laboratory.stellar.org/#account-creator?network=test)).

### Local Setup

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/Harsheyz/Stellar-connect-wallet-challenge.git
   ```

2. Navigate into the frontend application directory:
   ```bash
   cd Stellar-connect-wallet-challenge/stellar-connect-wallet
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Start the application:
   ```bash
   npm start
   ```

The application will launch and be accessible at `http://localhost:3000`.

---

## Usage Guide

1. **Connect:** Click the "Connect Wallet" button and approve the prompt in your Freighter extension.
2. **Review Balance:** Once connected, your public key and current testnet XLM balance will be displayed on the dashboard.
3. **Send XLM:** Enter a valid Stellar testnet destination address and the amount of XLM to send. Click "Submit Transaction" and approve the signature request in Freighter.
4. **Disconnect:** Use the disconnect button to clear the application state when finished.

---

## Screenshots

### Wallet Connection and Balance
Displays the user's public address and active XLM balance fetched from the network.
![Wallet Connected](./screenshots/wallet-connected.png)
*(Includes the balance state view: [Balance Displayed](./screenshots/balance-displayed.png))*

### Transaction Processing
Shows the Native Payment operation pending user signature via Freighter.
![Successful Transaction](./screenshots/transaction-success.png)

### Transaction Result
The final state confirming successful submission to the Stellar Testnet.
![Transaction Result](./screenshots/transaction-result.png)

---

## Transaction Proof

```
Transaction Id : ba51bbdb7c7bcd27a94657cbc8c90e1db4c62041f1dcec15184bc550ecb03ff2
Processed      : 2026-03-31 15:00:50 UTC
```

---

## Project Structure

```
stellar-connect-wallet/
├── public/                       # Static assets for the React application
├── src/                          # Application source code
│   ├── App.js                    # Core logic: handles state, Freighter API, and Stellar SDK operations
│   ├── App.css                   # Layout and component styles
│   ├── index.js                  # React entry point
│   ├── index.css                 # Global styling and Tailwind imports
│   └── reportWebVitals.js        # React performance measuring
├── package.json                  # Project metadata and dependency definitions
└── tailwind.config.js            # Configuration for Tailwind CSS styling
```

---

## Technology Stack

- **Framework:** React 19
- **Styling:** Tailwind CSS
- **Network Interface:** `@stellar/stellar-sdk`
- **Wallet Provider:** `@stellar/freighter-api`

---

## Network Configuration

This dApp is configured exclusively for the **Stellar Testnet**:
- **Horizon URL:** `https://horizon-testnet.stellar.org`
- **Passphrase:** `Test SDF Network ; September 2015`

---

## License

This project is licensed under the MIT License.
