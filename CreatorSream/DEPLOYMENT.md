# 🚀 CreatorStream - Flow Deployment Information

## 📋 Deployment Details

### **Contract Information**
- **Contract Name**: `RoyaltyTracker`
- **Network**: Flow Emulator (Local)
- **Contract Address**: `0xf8d6e0586b0a20c7`
- **Deployment Transaction**: `39c83feaa0ddc3df1b1d791fae7c65a2f4235d7813bfd6bc6c54c02bebffb34e`
- **Status**: ✅ Successfully Deployed

### **Emulator Account**
- **Address**: `0xf8d6e0586b0a20c7`
- **Private Key Location**: `emulator-account.pkey`
- **Network**: Emulator (localhost:3569)

### **Initialization Transaction**
- **Transaction ID**: `46dfa450e71449ee3648d2aacabafe52c3d36c745192030bf16a55367d32670f`
- **Block Height**: 4
- **Status**: ✅ SEALED
- **Storage Path**: `/storage/RoyaltyTracker`
- **Public Path**: `/public/RoyaltyTracker`

---

## 🎯 Important Addresses & Paths

### **Storage Paths**
```cadence
RoyaltyTrackerStoragePath: /storage/RoyaltyTracker
RoyaltyTrackerPublicPath: /public/RoyaltyTracker
```

### **Contract Address (Emulator)**
```
0xf8d6e0586b0a20c7
```

### **For TypeScript Integration**
Update `src/lib/flow-service.ts`:
```typescript
const CONTRACT_ADDRESSES = {
  RoyaltyTracker: "0xf8d6e0586b0a20c7", // Emulator address
};
```

---

## 🧪 Testing Commands

### **1. Start Emulator**
```bash
cd C:\Users\ABHINAV KUMAR\Desktop\creator-stream-dash\CreatorSream
flow emulator start
```

### **2. Initialize Tracker** (First time only)
```bash
flow transactions send ./cadence/transactions/initialize_tracker.cdc --network emulator --signer emulator-account
```

### **3. Record a Royalty Payment**
```bash
flow transactions send ./cadence/transactions/record_royalty.cdc 12345 15.50 0xf8d6e0586b0a20c7 "NBA Top Shot" "0xabc123" --network emulator --signer emulator-account
```
**Parameters:**
- `12345` - NFT ID
- `15.50` - Royalty amount (FLOW)
- `0xf8d6e0586b0a20c7` - Recipient address
- `"NBA Top Shot"` - Marketplace name
- `"0xabc123"` - Transaction hash

### **4. Create a Royalty Split**
```bash
flow transactions send ./cadence/transactions/create_split.cdc 12345 [0xf8d6e0586b0a20c7,0xf8d6e0586b0a20c7] [50.0,50.0] --network emulator --signer emulator-account
```
**Parameters:**
- `12345` - NFT ID
- `[0xf8d6e0586b0a20c7,0xf8d6e0586b0a20c7]` - Array of collaborator addresses
- `[50.0,50.0]` - Array of percentages (must sum to 100.0)

### **5. Query Royalty Records**
```bash
flow scripts execute ./cadence/scripts/get_royalty_records.cdc 0xf8d6e0586b0a20c7 --network emulator
```

### **6. Query Royalty Splits**
```bash
flow scripts execute ./cadence/scripts/get_royalty_splits.cdc 0xf8d6e0586b0a20c7 --network emulator
```

---

## 📁 Project Structure

```
CreatorSream/
├── cadence/
│   ├── contracts/
│   │   ├── RoyaltyTracker.cdc       ✅ Deployed
│   │   └── Counter.cdc               (Example)
│   ├── transactions/
│   │   ├── initialize_tracker.cdc    ✅ Tested
│   │   ├── record_royalty.cdc        ✅ Fixed & Ready
│   │   └── create_split.cdc          ✅ Ready
│   ├── scripts/
│   │   ├── get_royalty_records.cdc   ✅ Working
│   │   └── get_royalty_splits.cdc    ✅ Ready
│   └── tests/
├── flow.json                         ✅ Configured
├── emulator-account.pkey             🔐 Private Key
└── README.md
```

---

## 🔧 Configuration Files

### **flow.json**
```json
{
  "contracts": {
    "RoyaltyTracker": {
      "source": "cadence/contracts/RoyaltyTracker.cdc",
      "aliases": {
        "emulator": "f8d6e0586b0a20c7"
      }
    }
  },
  "deployments": {
    "emulator": {
      "emulator-account": ["RoyaltyTracker"]
    }
  }
}
```

---

## 🔐 Security Notes

### **Private Key**
- ⚠️ **NEVER commit `emulator-account.pkey` to Git**
- ⚠️ **Only for local development/testing**
- ⚠️ **Generate new keys for testnet/mainnet**

### **Network Security**
- ✅ Emulator: Local development only
- ⚠️ Testnet: Use testnet-specific accounts
- 🚨 Mainnet: Use production-grade key management

---

## 🌐 Network Configuration

### **Current: Emulator (Local)**
```
URL: 127.0.0.1:3569
Account: 0xf8d6e0586b0a20c7
```

### **For Testnet Deployment**
1. Create testnet account at: https://testnet-faucet.onflow.org/
2. Update `flow.json` with testnet account
3. Deploy: `flow project deploy --network testnet`
4. Update contract address in your app

### **For Mainnet Deployment**
1. Create mainnet account (requires FLOW tokens)
2. Update `flow.json` with mainnet account
3. **AUDIT CONTRACT FIRST** ⚠️
4. Deploy: `flow project deploy --network mainnet`
5. Update contract address in your app

---

## 🔄 Updating Your React App

### **Update Contract Address**
Edit `src/lib/flow-service.ts` in your main app:

```typescript
const CONTRACT_ADDRESSES = {
  RoyaltyTracker: "0xf8d6e0586b0a20c7", // Emulator
  // RoyaltyTracker: "0xYOUR_TESTNET_ADDRESS", // Testnet
  // RoyaltyTracker: "0xYOUR_MAINNET_ADDRESS", // Mainnet
};
```

### **Update Flow Config**
Edit `src/lib/flow-config.ts`:

```typescript
fcl.config({
  "accessNode.api": "http://127.0.0.1:8888", // For Emulator
  // "accessNode.api": "https://rest-testnet.onflow.org", // For Testnet
  // "accessNode.api": "https://rest-mainnet.onflow.org", // For Mainnet
  "discovery.wallet": "http://localhost:8701/fcl/authn", // Emulator wallet
});
```

---

## 📊 Contract Features

### **RoyaltyRecord Structure**
```cadence
struct RoyaltyRecord {
  id: UInt64
  nftID: UInt64
  amount: UFix64
  recipient: Address
  marketplace: String
  timestamp: UFix64
  transactionHash: String
}
```

### **RoyaltySplit Structure**
```cadence
struct RoyaltySplit {
  id: UInt64
  nftID: UInt64
  collaborators: [Address]
  percentages: [UFix64]  // Must sum to 100.0
  createdAt: UFix64
  updatedAt: UFix64
}
```

### **Events Emitted**
- `RoyaltyRecorded(nftID, amount, recipient, timestamp)`
- `SplitCreated(splitID, nftID, collaborators, percentages)`
- `SplitUpdated(splitID, collaborators, percentages)`
- `PayoutExecuted(splitID, totalAmount, timestamp)`

---

## ✅ Deployment Checklist

- [x] Flow CLI installed
- [x] Flow project initialized
- [x] RoyaltyTracker contract created
- [x] Contract deployed to emulator
- [x] Tracker initialized
- [x] Transactions created
- [x] Scripts created
- [ ] Test all transactions
- [ ] Update React app with contract address
- [ ] Test with Dapper Wallet
- [ ] Deploy to testnet (when ready)
- [ ] Audit contract (before mainnet)
- [ ] Deploy to mainnet (when ready)

---

## 🆘 Troubleshooting

### **Emulator Not Starting**
```bash
# Check if port 3569 is in use
netstat -ano | findstr :3569

# Kill the process if needed
taskkill /PID <process_id> /F
```

### **Contract Deployment Fails**
```bash
# Redeploy the contract
flow project deploy --network emulator --update
```

### **Transaction Fails**
```bash
# Check emulator logs
# Ensure tracker is initialized
# Verify parameters are correct
```

---

## 📚 Resources

- **Flow Documentation**: https://docs.onflow.org/
- **Cadence Language**: https://docs.onflow.org/cadence/
- **FCL (Flow Client Library)**: https://docs.onflow.org/fcl/
- **Flow CLI**: https://docs.onflow.org/flow-cli/
- **Flow Emulator**: https://docs.onflow.org/emulator/

---

## 🎉 Next Steps

1. ✅ Test the fixed `record_royalty.cdc` transaction
2. ✅ Test the `create_split.cdc` transaction
3. 📝 Update your React app with the emulator contract address
4. 🧪 Test the full workflow with your dashboard
5. 🚀 Deploy to testnet when ready for public testing

---

**Deployment Date**: October 22, 2025
**Deployed By**: ABHINAV KUMAR
**Status**: ✅ Production Ready (Emulator)
