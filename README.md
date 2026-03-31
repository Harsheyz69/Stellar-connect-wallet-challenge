# Stellar Connect Wallet Testnet DApp

A modern, responsive decentralized application (dApp) built on the Stellar Testnet. This application allows users to securely connect their Freighter wallet, check their XLM balance, and execute testnet transactions with real-time interface feedback. Built with React and styled using Tailwind CSS.

## Features

- **Freighter Wallet Integration**: Secure connection supporting dynamic account switching (`WatchWalletChanges`).
- **Real-Time Balance Check**: Interfaces directly with the `@stellar/stellar-sdk` and `@stellar/freighter-api` to read XLM balances.
- **Testnet Transactions**: Users can effortlessly perform native XLM transactions targeting predefined robust Testnet addresses.
- **Rich Status Feedback**: Intuitive loading states, transaction processing loaders, and success/error status messages inline.

## Setup Instructions

### Prerequisites
1. [Node.js](https://nodejs.org/) (v16.x or newer recommended)
2. [Freighter Wallet Browser Extension](https://www.freighter.app/)
3. Ensure your Freighter wallet is switched to the **Testnet** network. You can fund your address with free testnet tokens using the [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=test).

### Running Locally

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Harsheyz/Stellar-connect-wallet-challenge.git
   ```

2. Navigate into the specific frontend application directory:
   ```bash
   cd Stellar-connect-wallet-challenge/stellar-connect-wallet
   ```

3. Install all the necessary dependencies:
   ```bash
   npm install
   ```

4. Launch the local development server:
   ```bash
   npm start
   ```

5. The application should automatically launch in your default browser at `http://localhost:3000`.

## Screenshots

*(Please replace the placeholders in this section with actual screenshots from your tests)*

### 1. Wallet Connected State
> *Shows the user's Freighter address masked on the dashboard*
![Wallet Connected](screenshots/wallet-connected.png)

### 2. Balance Displayed
> *Displays the dynamically fetched testnet XLM balance*
![Balance Displayed](screenshots/balance-displayed.png)

### 3. Successful Testnet Transaction
> *Shows the transaction processing loader and the success state overlay*
![Successful Transaction](screenshots/transaction-success.png)

### 4. Transaction Result is Shown
> *The resulting UI message rendering the submitted transaction confirmation*
![Transaction Result](screenshots/transaction-result.png)
