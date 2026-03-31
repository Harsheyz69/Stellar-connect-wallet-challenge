import React, { useState, useEffect } from "react";
import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  signTransaction,
  WatchWalletChanges,
} from "@stellar/freighter-api";
import { Horizon, TransactionBuilder, Networks, Asset, Operation } from "@stellar/stellar-sdk";
import { Wallet, LogOut, Send, AlertCircle, CheckCircle2, Clock } from "lucide-react";

const SERVER = new Horizon.Server("https://horizon-testnet.stellar.org");

function App() {
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState(null);
  const [targetAddress, setTargetAddress] = useState(
    "GA3YXZ5O5DNGZONZY5YGBR3PIG3O4T7YVGB2M62VUT4Q3H2D4Z4SOWS4" // Fallback target
  );
  const [amount, setAmount] = useState("1");
  const [txStatus, setTxStatus] = useState({ status: "idle", hash: "", error: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWalletConnection();
    
    // Automatically detect when user switches accounts inside the Freighter extension
    const watcher = new WatchWalletChanges();
    watcher.watch(async ({ address, error }) => {
      if (!error && address) {
        setPublicKey(address);
        await fetchBalance(address);
      }
    });

    return () => {
      watcher.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkWalletConnection = async () => {
    try {
      const conn = await isConnected();
      if (conn.isConnected) {
        const allowedInfo = await isAllowed();
        if (allowedInfo.isAllowed) {
          const { address, error } = await getAddress();
          if (address && !error) {
            setPublicKey(address);
            fetchBalance(address);
          }
        }
      }
    } catch (e) {
      console.error("Freighter error:", e);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      let conn = { isConnected: false };
      try { conn = await isConnected(); } catch(e){}

      if (conn.isConnected) {
        const { address, error } = await requestAccess();
        if (error) {
          console.error("Wallet access rejected:", error);
        } else if (address) {
          setPublicKey(address);
          await fetchBalance(address);
        }
      } else {
        alert("Freighter is not installed or available.");
      }
    } catch (e) {
      console.error("Connection error:", e);
    }
    setLoading(false);
  };

  const handleDisconnect = () => {
    setPublicKey("");
    setBalance(null);
    setTxStatus({ status: "idle", hash: "", error: "" });
  };

  const fetchBalance = async (pubKey) => {
    try {
      const account = await SERVER.loadAccount(pubKey);
      const nativeBalance = account.balances.find((b) => b.asset_type === "native");
      if (nativeBalance) {
        setBalance(nativeBalance.balance);
      }
    } catch (e) {
      console.error("Error fetching balance. Account may be unfunded.", e);
      setBalance("0.0000000 (Unfunded Account)");
    }
  };

  const handleSendTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTxStatus({ status: "pending", hash: "", error: "" });

    try {
      // 1. Fetch Source Account
      const sourceAccount = await SERVER.loadAccount(publicKey);
      const fee = await SERVER.fetchBaseFee();

      // 2. Build testnet transaction
      const tx = new TransactionBuilder(sourceAccount, {
        fee,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: targetAddress,
            asset: Asset.native(),
            amount: amount,
          })
        )
        .setTimeout(180)
        .build();

      // 3. Request Signature from Freighter
      const { signedTxXdr, error: signError } = await signTransaction(tx.toXDR(), {
        networkPassphrase: Networks.TESTNET,
      });

      if (signError) {
        throw new Error(signError);
      }

      // 4. Construct signed transaction & submit
      const signedTx = TransactionBuilder.fromXDR(
        signedTxXdr,
        Networks.TESTNET
      );

      const txResult = await SERVER.submitTransaction(signedTx);
      
      // Update UI & refresh balance
      setTxStatus({ status: "success", hash: txResult.hash, error: "" });
      fetchBalance(publicKey);

    } catch (error) {
      console.error("Transaction Error:", error);
      let errorMsg = error?.message || "Transaction failed";
      
      // Attempt to extract Horizon error messages
      if (error?.response?.data?.extras?.result_codes) {
        const rc = error.response.data.extras.result_codes;
        errorMsg = `Horizon Error: tx=${rc.transaction}, ops=${rc.operations?.join(",")}`;
      }
      
      setTxStatus({ status: "error", hash: "", error: errorMsg });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="p-8 border-b border-slate-700 bg-slate-800/50">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Stellar dApp
            </h1>
            {!publicKey ? (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 transition-colors rounded-xl font-medium text-sm"
              >
                <Wallet size={16} />
                {loading ? "Connecting..." : "Connect"}
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 px-4 py-2 border border-slate-600 hover:bg-slate-700 transition-colors rounded-xl font-medium text-sm text-slate-300"
              >
                <LogOut size={16} />
                Disconnect
              </button>
            )}
          </div>

          {/* Balance Area */}
          {publicKey ? (
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mb-1">
                Connected Wallet
              </p>
              <p className="text-sm text-slate-300 font-mono mb-4 break-all opacity-80">
                {publicKey}
              </p>
              <div className="flex items-end gap-2 text-emerald-400 mb-4">
                <span className="text-4xl font-bold tracking-tight">
                  {balance !== null ? balance : "..."}
                </span>
                <span className="text-lg font-medium mb-1">XLM</span>
              </div>
              <p className="text-xs text-slate-500 italic">
                Looking for your other account? Open the Freighter browser extension and switch your active wallet. The app will update automatically!
              </p>
            </div>
          ) : (
            <div className="text-center py-8 opacity-70">
              <p className="text-slate-400 mb-2">Welcome to Level 1 - White Belt</p>
              <p className="text-sm text-slate-500">Connect your Freighter testnet wallet to begin.</p>
            </div>
          )}
        </div>

        {/* Transaction Form */}
        {publicKey && (
          <div className="p-8">
            <h2 className="text-lg font-semibold mb-6">Send XLM</h2>
            <form onSubmit={handleSendTransaction} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Destination Address
                </label>
                <input
                  type="text"
                  required
                  value={targetAddress}
                  onChange={(e) => setTargetAddress(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 font-mono text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="G..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Amount (XLM)
                </label>
                <input
                  type="number"
                  step="0.0000001"
                  required
                  min="0.0000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 font-medium placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0.0"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Clock size={20} className="animate-spin" /> : <Send size={20} />}
                {loading ? "Processing..." : "Submit Transaction"}
              </button>
            </form>

            {/* Status Messages */}
            {txStatus.status === "error" && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium break-words leading-relaxed">
                  {txStatus.error}
                </p>
              </div>
            )}

            {txStatus.status === "success" && (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 text-emerald-400">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                <div className="text-sm font-medium overflow-hidden">
                  <p className="mb-1 text-emerald-300">Transaction Successful!</p>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${txStatus.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate block hover:underline text-emerald-500 opacity-80"
                    title="View on Stellar Expert"
                  >
                    Hash: {txStatus.hash}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
