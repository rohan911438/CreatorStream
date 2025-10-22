# Flow Workflow Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Review the Flow Workflow Structure

Your Flow blockchain workflow is now complete with:

✅ **Smart Contract** (`cadence/contracts/RoyaltyTracker.cdc`)
✅ **Transactions** (4 transaction files in `cadence/transactions/`)
✅ **Scripts** (4 script files in `cadence/scripts/`)
✅ **TypeScript Service** (`src/lib/flow-service.ts`)
✅ **React Hook** (`src/hooks/use-flow.ts`)
✅ **Example Component** (`src/components/dashboard/FlowWorkflowExample.tsx`)

### Step 2: Test Locally (Development Mode)

You can test the Flow workflow **right now** without deploying:

1. **Use the Example Component:**
   ```typescript
   // Add to any dashboard view
   import { FlowWorkflowExample } from "@/components/dashboard/FlowWorkflowExample";
   
   // In your component:
   <FlowWorkflowExample />
   ```

2. **Or Use the Hook Directly:**
   ```typescript
   import { useFlow } from "@/hooks/use-flow";
   
   const { initialize, addRoyaltyRecord, fetchRoyaltyRecords } = useFlow();
   ```

### Step 3: Deploy to Flow Testnet (When Ready)

When you're ready to deploy to the actual Flow blockchain:

1. **Install Flow CLI:**
   ```bash
   # Windows (PowerShell)
   iex "& { $(irm 'https://raw.githubusercontent.com/onflow/flow-cli/master/install.ps1') }"
   ```

2. **Create Flow Account:**
   - Visit: https://testnet-faucet.onflow.org/
   - Create a testnet account
   - Save your private key securely

3. **Configure Flow CLI:**
   ```bash
   flow init
   ```

4. **Deploy Contract:**
   ```bash
   flow accounts add-contract RoyaltyTracker ./cadence/contracts/RoyaltyTracker.cdc --network=testnet
   ```

5. **Update Contract Address:**
   Edit `src/lib/flow-service.ts` line 8:
   ```typescript
   const CONTRACT_ADDRESSES = {
     RoyaltyTracker: "0xYOUR_DEPLOYED_ADDRESS", // Replace this
   };
   ```

### Step 4: Integrate with Your Dashboard

**Option A: Add to Existing View**

Example: Add to `DashboardOverview.tsx`:

```typescript
import { useFlow } from "@/hooks/use-flow";
import { useEffect, useState } from "react";

export function DashboardOverview() {
  const { fetchRoyaltyRecords, isConnected } = useFlow();
  const [totalRoyalties, setTotalRoyalties] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (isConnected) {
        const records = await fetchRoyaltyRecords();
        const total = records.reduce((sum, r) => sum + parseFloat(r.amount), 0);
        setTotalRoyalties(total);
      }
    };
    loadData();
  }, [isConnected]);

  return (
    <div>
      <h2>Total Royalties: {totalRoyalties} FLOW</h2>
      {/* Rest of your component */}
    </div>
  );
}
```

**Option B: Create New View**

Add a "Blockchain" view to your dashboard:

```typescript
// In Dashboard.tsx
export type DashboardView = 
  | "overview" 
  | "analytics" 
  | "transactions" 
  | "splits" 
  | "notifications" 
  | "payouts"
  | "blockchain"; // Add this

// In renderView():
case "blockchain":
  return <FlowWorkflowExample />;
```

### Step 5: Use Flow Functions in Your Components

**Record Royalty:**
```typescript
const { addRoyaltyRecord } = useFlow();

const recordPayment = async (nftId: number, amount: number) => {
  const result = await addRoyaltyRecord(
    nftId,
    amount,
    userAddress,
    "NBA Top Shot",
    txHash
  );
  
  if (result.success) {
    // Update UI
  }
};
```

**Manage Splits:**
```typescript
const { addSplit, modifySplit } = useFlow();

// Create new split
await addSplit(nftId, addresses, percentages);

// Update existing split
await modifySplit(splitId, newAddresses, newPercentages);
```

**Query Data:**
```typescript
const { fetchRoyaltyRecords, fetchRoyaltySplits } = useFlow();

// Get all royalties
const records = await fetchRoyaltyRecords();

// Get all splits
const splits = await fetchRoyaltySplits();
```

### Step 6: Testing Checklist

Before going to production:

- [ ] Connect Dapper Wallet successfully
- [ ] Initialize tracker (first time)
- [ ] Record a test royalty
- [ ] Create a test split (percentages sum to 100)
- [ ] Query royalty records
- [ ] Query royalty splits
- [ ] Update a split
- [ ] Verify all transactions on Flow Testnet explorer

## 🎯 Common Use Cases

### 1. Track NBA Top Shot Royalties
```typescript
await addRoyaltyRecord(
  momentId,
  royaltyAmount,
  creatorAddress,
  "NBA Top Shot",
  transactionHash
);
```

### 2. Split Between Team Members
```typescript
await addSplit(
  nftId,
  ["0xCreator", "0xArtist", "0xDeveloper"],
  [50.0, 30.0, 20.0]
);
```

### 3. Dashboard Analytics
```typescript
const records = await fetchRoyaltyRecords();
const totalEarned = records.reduce((sum, r) => sum + parseFloat(r.amount), 0);
const avgRoyalty = totalEarned / records.length;
```

## 🛠️ Development Workflow

```bash
# 1. Start your dev server
npm run dev

# 2. Connect Dapper Wallet
# Click "Connect Wallet" in your app

# 3. Initialize (first time only)
# Use the FlowWorkflowExample component or call initialize()

# 4. Start using Flow functions
# Record royalties, create splits, query data

# 5. View on Flow Explorer
# Visit: https://testnet.flowscan.org/
```

## 📊 What You Can Build Now

With this Flow workflow, you can:

1. ✅ **Track all royalty payments on-chain**
2. ✅ **Manage royalty splits between collaborators**
3. ✅ **Query historical royalty data**
4. ✅ **Analyze earnings by NFT**
5. ✅ **Verify all transactions on Flow blockchain**
6. ✅ **Build transparent royalty distribution system**

## 🎓 Learn More

- **Full Documentation**: See `cadence/README.md`
- **Contract Code**: Check `cadence/contracts/RoyaltyTracker.cdc`
- **Example Component**: Study `src/components/dashboard/FlowWorkflowExample.tsx`
- **Flow Docs**: https://docs.onflow.org/
- **Cadence Tutorials**: https://docs.onflow.org/cadence/tutorial/01-first-steps/

## 🆘 Need Help?

Common issues and solutions:

**"Wallet not connected"**
→ Make sure Dapper Wallet is connected first

**"Tracker not initialized"**
→ Run `initialize()` once before using other functions

**"Percentages don't sum to 100"**
→ Ensure split percentages add up to exactly 100.0

**"Transaction failed"**
→ Check you have enough FLOW for gas fees

## ✨ You're Ready!

Your Flow blockchain workflow is **fully set up and ready to use**! 

Start by:
1. Running your app (`npm run dev`)
2. Connecting your Dapper Wallet
3. Opening the FlowWorkflowExample component
4. Initializing your tracker
5. Recording your first royalty!

Happy building! 🚀
