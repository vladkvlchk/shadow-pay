// Mock wallet implementation that simulates real wallet behavior

export interface MockWallet {
  address: string;
  privateKey: string;
  balance: number;
  isConnected: boolean;
}

export interface MockTransaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
  comment?: string;
}

// Generate a realistic looking Ethereum address
export function generateMockAddress(): string {
  const chars = "0123456789abcdef";
  let address = "0x";
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

// Generate a realistic looking private key
export function generateMockPrivateKey(): string {
  const chars = "0123456789abcdef";
  let privateKey = "0x";
  for (let i = 0; i < 64; i++) {
    privateKey += chars[Math.floor(Math.random() * chars.length)];
  }
  return privateKey;
}

// Generate a realistic looking transaction hash
export function generateMockTxHash(): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Create or retrieve mock wallet from localStorage
export function getOrCreateMockWallet(): MockWallet {
  const stored = localStorage.getItem("ShadowPay_mock_wallet");

  if (stored) {
    return JSON.parse(stored);
  }

  // Create new mock wallet
  const wallet: MockWallet = {
    address: generateMockAddress(),
    privateKey: generateMockPrivateKey(),
    balance: Math.random() * 10 + 1, // Random balance between 1-11 INTMAX
    isConnected: false,
  };

  localStorage.setItem("ShadowPay_mock_wallet", JSON.stringify(wallet));
  return wallet;
}

// Save wallet state
export function saveMockWallet(wallet: MockWallet): void {
  localStorage.setItem("ShadowPay_mock_wallet", JSON.stringify(wallet));
}

// Get transaction history
export function getMockTransactions(): MockTransaction[] {
  const stored = localStorage.getItem("ShadowPay_mock_transactions");
  return stored ? JSON.parse(stored) : [];
}

// Save transaction
export function saveMockTransaction(transaction: MockTransaction): void {
  const transactions = getMockTransactions();
  transactions.unshift(transaction); // Add to beginning
  localStorage.setItem(
    "ShadowPay_mock_transactions",
    JSON.stringify(transactions)
  );
}

// Simulate wallet connection with delay
export async function simulateWalletConnection(): Promise<MockWallet> {
  // Simulate connection delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1500 + Math.random() * 1000)
  );

  const wallet = getOrCreateMockWallet();
  wallet.isConnected = true;
  saveMockWallet(wallet);

  return wallet;
}

// Simulate wallet disconnection
export async function simulateWalletDisconnection(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const wallet = getOrCreateMockWallet();
  wallet.isConnected = false;
  saveMockWallet(wallet);
}

// Simulate payment transaction
export async function simulatePayment(
  recipientAddress: string,
  amount: number,
  comment?: string
): Promise<MockTransaction> {
  const wallet = getOrCreateMockWallet();

  if (!wallet.isConnected) {
    throw new Error("Wallet not connected");
  }

  if (wallet.balance < amount) {
    throw new Error("Insufficient balance");
  }

  // Simulate transaction processing time
  await new Promise((resolve) =>
    setTimeout(resolve, 2000 + Math.random() * 2000)
  );

  // 10% chance of failure to simulate real-world scenarios
  if (Math.random() < 0.1) {
    throw new Error("Transaction failed due to network congestion");
  }

  const transaction: MockTransaction = {
    hash: generateMockTxHash(),
    from: wallet.address,
    to: recipientAddress,
    amount,
    timestamp: Date.now(),
    status: "pending",
    comment,
  };

  // Update wallet balance
  wallet.balance -= amount;
  saveMockWallet(wallet);

  // Save transaction
  saveMockTransaction(transaction);

  // Simulate confirmation after a delay
  setTimeout(() => {
    const transactions = getMockTransactions();
    const tx = transactions.find((t) => t.hash === transaction.hash);
    if (tx) {
      tx.status = "confirmed";
      localStorage.setItem(
        "ShadowPay_mock_transactions",
        JSON.stringify(transactions)
      );
    }
  }, 5000 + Math.random() * 10000);

  return transaction;
}

// Check if wallet exists and is connected
export function isWalletConnected(): boolean {
  const wallet = getOrCreateMockWallet();
  return wallet.isConnected;
}

// Get current wallet balance
export function getWalletBalance(): number {
  const wallet = getOrCreateMockWallet();
  return wallet.balance;
}

// Add some mock balance (for testing)
export function addMockBalance(amount: number): void {
  const wallet = getOrCreateMockWallet();
  wallet.balance += amount;
  saveMockWallet(wallet);
}
