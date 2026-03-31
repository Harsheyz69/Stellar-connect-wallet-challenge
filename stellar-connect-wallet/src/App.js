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
    <div className="relative min-h-screen bg-[#050505] text-gray-100 flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Background Animated Blobs for Glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-lg bg-white/[0.02] backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-hidden border border-white/[0.05]">
        {/* Header */}
        <div className="p-8 border-b border-white/[0.05] bg-black/20">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-200">
              Stellar dApp
            </h1>
            {!publicKey ? (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-tr from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 shadow-lg shadow-orange-500/20 transition-all rounded-xl font-medium text-sm text-white border border-orange-400/20"
              >
                <Wallet size={16} />
                {loading ? "Connecting..." : "Connect"}
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 transition-all rounded-xl font-medium text-sm text-gray-300 hover:text-white backdrop-blur-md"
              >
                <LogOut size={16} />
                Disconnect
              </button>
            )}
          </div>

          {/* Balance Area */}
          {publicKey ? (
            <div className="bg-black/30 p-6 rounded-2xl border border-white/10 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
              
              <div className="relative z-10">
                <p className="text-xs text-orange-200/50 font-medium tracking-widest uppercase mb-1">
                  Connected Wallet
                </p>
                <p className="text-sm text-gray-300 font-mono mb-4 break-all opacity-90">
                  {publicKey}
                </p>
                <div className="flex items-end gap-2 text-orange-400 mb-4 drop-shadow-md">
                  <span className="text-4xl font-bold tracking-tight">
                    {balance !== null ? balance : "..."}
                  </span>
                  <span className="text-lg font-medium mb-1 text-orange-300">XLM</span>
                </div>
                <p className="text-xs text-gray-500 italic">
                  Switch your active wallet in the Freighter extension to automatically update.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 opacity-70">
              <p className="text-gray-400 mb-2 font-medium">Welcome to Level 1 - White Belt</p>
              <p className="text-sm text-gray-500">Connect your Freighter testnet wallet to begin.</p>
            </div>
          )}
        </div>

        {/* Transaction Form */}
        {publicKey && (
          <div className="p-8">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-100">
              <Send size={18} className="text-orange-400" />
              Send XLM
            </h2>
            <form onSubmit={handleSendTransaction} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Destination Address
                </label>
                <input
                  type="text"
                  required
                  value={targetAddress}
                  onChange={(e) => setTargetAddress(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-200 font-mono text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-md transition-all shadow-inner"
                  placeholder="G..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Amount (XLM)
                </label>
                <input
                  type="number"
                  step="0.0000001"
                  required
                  min="0.0000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-200 font-medium placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-md transition-all shadow-inner"
                  placeholder="0.0"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:via-amber-500 hover:to-orange-400 text-white rounded-xl font-medium transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-orange-400/30"
              >
                {loading ? <Clock size={20} className="animate-spin" /> : <Send size={20} />}
                {loading ? "Processing..." : "Submit Transaction"}
              </button>
            </form>

            {/* Status Messages */}
            {txStatus.status === "error" && (
              <div className="mt-6 p-4 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-400 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium break-words leading-relaxed text-red-300">
                  {txStatus.error}
                </p>
              </div>
            )}

            {txStatus.status === "success" && (
              <div className="mt-6 p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-start gap-3 text-emerald-400 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                <div className="text-sm font-medium overflow-hidden">
                  <p className="mb-1 text-emerald-300 font-semibold tracking-wide">Transaction Successful!</p>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${txStatus.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate block hover:underline text-emerald-500/90 hover:text-emerald-400 transition-colors"
                    title="View on Stellar Expert"
                  >
                    Hash: <span className="font-mono text-xs opacity-80">{txStatus.hash}</span>
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
