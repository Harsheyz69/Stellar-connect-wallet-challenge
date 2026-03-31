# Stellar Connect Wallet 🌟

A modern, user-friendly decentralized application (dApp) for managing Stellar (XLM) assets with seamless wallet integration, built with React and styled with Tailwind CSS.

![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## ✨ Features

- **🔗 Wallet Connection**: Seamlessly connect your Freighter wallet with one click (supports dynamic account switching).
- **💰 Balance Display**: Real-time XLM balance fetched directly from the Stellar Testnet.
- **📬 Send XLM**: Transfer XLM tokens to other Stellar addresses effortlessly.
- **🔐 Secure**: No private keys stored locally - all transactions are safely signed through the Freighter extension.
- **🎨 Beautiful UI**: Modern, responsive interface with smooth animations and dynamic loading states.
- **🌙 Dark Theme**: Eye-friendly dark gradient design providing a premium user experience.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- [Freighter Wallet](https://www.freighter.app/) browser extension installed

### Installation

```bash
# Clone the repository
git clone https://github.com/Harsheyz/Stellar-connect-wallet-challenge.git
cd Stellar-connect-wallet-challenge/stellar-connect-wallet

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

---

## 📖 How to Use

### 1. **Connect Your Wallet**
   - Click the "Connect Wallet" button on the screen
   - Approve the connection in your Freighter wallet popup
   - Your wallet address will appear instantly beneath

### 2. **View Your Balance**
   - Your XLM balance is displayed automatically once connected
   - Updates are fetched dynamically from the Stellar Testnet

### 3. **Send XLM**
   - Head to the "Send XLM" section
   - Enter the recipient's Stellar address and the desired amount
   - Click "Submit Transaction"
   - Review the transaction and sign it using the Freighter popup
   - Wait for the on-screen success confirmation!

### 4. **Disconnect**
   - Click "Disconnect" to exit out of your session
   - Your local application state is cleared - no persistent storage

---

## 📸 Screenshots

### Wallet Connected & Balance Display
Connected wallet showing the user address, the active balance (XLM amount), and dynamic elements.
![Wallet Connected](./screenshots/wallet-connected.png)
*(See also: [Balance Displayed](./screenshots/balance-displayed.png))*

### Successful Testnet Transaction
Processing a native XLM transfer with the Freighter signature request.
![Successful Transaction](./screenshots/transaction-success.png)

### Transaction Result Complete
The resulting success state reflecting the confirmed hash to the user.
![Transaction Result](./screenshots/transaction-result.png)

---

# TRANSACTION PROOF

```
Transaction Id : ba51bbdb7c7bcd27a94657cbc8c90e1db4c62041f1dcec15184bc550ecb03ff2
Processed      : 2026-03-31 15:00:50 UTC
```

---

## 🏗️ Project Structure

```
stellar-connect-wallet/
├── src/
│   ├── App.js                    # Main app component containing transaction and wallet logic
│   ├── App.css                   # Component-specific styles
│   ├── index.js                  # Global Entry point
│   ├── index.css                 # Global styles and Tailwind imports
│   └── reportWebVitals.js        # Performance metrics setup
├── public/                       # Static assets
├── package.json                  # Dependencies configuration
├── tailwind.config.js            # Tailwind configuration
└── README.md                     # This file
```

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19.2](https://react.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Blockchain Integration**: 
  - [@stellar/stellar-sdk](https://developers.stellar.org/docs/reference/sdk-reference)
  - [@stellar/freighter-api](https://www.freighter.app/)
- **Build Tool**: [Create React App](https://create-react-app.dev/)

---

## 🔧 Key Implementation Details

### App.js
Serves as a monolithic driver that handles all application states and blockchain interactions, such as:
- Initializing the connection using `@stellar/freighter-api` (`setAllowed`).
- Checking the dynamic active wallet using `getPublicKey` and `WatchWalletChanges`.
- Fetching balance using `@stellar/stellar-sdk`'s `Horizon.Server`.
- Building and submitting Native Payment operations (`Operation.payment`).
- Signing transactions securely with Freighter (`signTransaction`).

---

## 🌐 Network

This application specifically runs autonomously on the **Stellar Test Network (Testnet)**.

- **Horizon API**: `https://horizon-testnet.stellar.org`
- **Network Passphrase**: `Test SDF Network ; September 2015`

⚠️ **Note**: No real XLM is utilized. For free testnet lumens, test your address utilizing the [Stellar Testnet Friendbot](https://laboratory.stellar.org/?network=test#friendbot).

---

## 🔐 Security

- **Private Keys**: Never stored or extracted - Freighter handles the encrypted signing process locally.
- **Network**: Relies upon HTTPS for all horizon API calls.
- **Testnet Scope**: Perfectly safe for development, learning, and testing scenarios.
- **No Backend Server**: Entirely client-side and interacts strictly on-chain.

---

## 🎨 UI Features

- **Responsive Design**: Robust interface functioning reliably across multiple screen widths.
- **Dark Mode Aesthetic**: A deeply immersive dark theme providing a highly professional feel.
- **Micro-Animations**: Clean fade-in effects, hover states, and smooth processing loaders.
- **Error Handling**: Graceful error catching rendering clean error banners when inputs fail.

---

## 🚦 Getting Started with Freighter

1. **Install Freighter**:
   - Visit [freighter.app](https://www.freighter.app/)
   - Install the extension for Chrome, Firefox, or Brave.

2. **Create/Import Account**:
   - Create a new account layout.
   - Secure and save your secret phrase physically.

3. **Add Testnet Account**:
   - Open Freighter network settings -> Switch to **Testnet**.
   - Claim free testnet XLM via [Friendbot](https://laboratory.stellar.org/?network=test#friendbot).

4. **Connect to App**:
   - Load the Stellar Connect Wallet in your browser.
   - Click "Connect" and issue approval via Freighter's prompt.

---

## 📚 Resources

- **Stellar Documentation**: https://developers.stellar.org/
- **Freighter API Docs**: https://docs.freighter.app/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev/

---

## 🤝 Contributing

Contributions are heavily welcome! To contribute:

1. Fork the repository
2. Create your own feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request for review

---

## 📄 License

This project is open-sourced and licensed under the MIT License - please see the LICENSE file for details.

<div align="center">

**Made with React + Stellar ✨**

[Install Freighter](https://www.freighter.app/) • [Stellar Docs](https://developers.stellar.org/) • [Report Bug](https://github.com/Harsheyz/Stellar-connect-wallet-challenge/issues)

</div>
