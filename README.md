# 🎵 CreatorStream - NFT Royalty Tracking on Flow

<div align="center">

![CreatorStream Banner](https://img.shields.io/badge/Built%20for-Forte%20Hacks-purple?style=for-the-badge)
![Flow Blockchain](https://img.shields.io/badge/Flow-Blockchain-00EF8B?style=for-the-badge&logo=flow)
![Dapper Wallet](https://img.shields.io/badge/Dapper-Wallet-6B46C1?style=for-the-badge)

**Automate and track your NFT royalties with blockchain transparency**

[Live Demo - creatorstream.lovable.app](https://creatorstream.lovable.app) | [Video Demo](https://youtu.be/oKXEZIw_xOY?si=-ewsiuwMBPCuYgxF) | [Documentation](#documentation)

</div>

---

## 🏆 Forte Hacks 2025 Submission

**Project**: CreatorStream  
**Team**: BROTHERHOOD  
**Developer**: Rohan Kumar  
**Email**: 123131rkorohan@gmail.com  
**Repository**: https://github.com/rohan911438/CreatorStream

### 🎯 Challenge
Built for Forte Hacks to solve NFT creator payment tracking using Flow blockchain and Dapper Wallet integration.

---

## 📋 Project Overview

CreatorStream is a decentralized application built on the Flow blockchain that automates NFT royalty tracking and distribution for digital creators. It eliminates manual tracking, provides transparent on-chain records, and enables automated revenue splits among collaborators.

### 💡 The Problem
- NFT creators struggle to track royalties across multiple marketplaces
- Manual spreadsheet tracking is time-consuming and error-prone
- No transparent way to verify royalty payments
- Difficult to manage revenue splits with collaborators

### ✨ Our Solution
- **Automated Tracking**: Record all royalty payments on Flow blockchain
- **Smart Splits**: Automatically calculate and distribute revenue shares
- **Real-time Analytics**: Visual dashboards showing earnings trends
- **Blockchain Verified**: Every transaction is transparent and auditable
- **Multi-Wallet Support**: Works with Dapper Wallet and Blocto

---

## 🚀 Key Features

### 🔐 Wallet Integration
- **Dapper Wallet** & **Blocto** support
- Seamless wallet switching
- Secure authentication via Flow Client Library (FCL)
- Session persistence

### 📊 Dashboard
- **Overview**: Total earnings, pending payouts, recent transactions
- **Analytics**: Interactive charts showing royalty trends over time
- **Transactions**: Complete history of all royalty payments
- **Splits**: Manage collaborator revenue distribution
- **Notifications**: Real-time alerts for new payments
- **Payouts**: Track upcoming and completed distributions

### ⛓️ Blockchain Features
- **RoyaltyTracker Smart Contract** (Cadence)
- On-chain storage of all royalty records
- Immutable transaction history
- Split validation (must sum to 100%)
- Event emissions for tracking

### 🎨 User Experience
- Modern, responsive UI built with React + TypeScript
- Dark/Light theme support
- Mobile-friendly design
- Real-time data updates
- Smooth animations with Framer Motion

---

## 🏗️ Technical Architecture

<div align="center">
<img src="./public/assets/architecture-diagram.png" alt="CreatorStream Architecture" width="800"/>
</div>

### **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │   Landing   │  │  Dashboard   │  │    Analytics       │    │
│  │    Page     │  │   Overview   │  │     Charts         │    │
│  └─────────────┘  └──────────────┘  └────────────────────┘    │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │Transactions │  │    Splits    │  │   Notifications    │    │
│  │   History   │  │  Management  │  │      & Alerts      │    │
│  └─────────────┘  └──────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    FLOW CLIENT LIBRARY (FCL)                    │
│                     Wallet Authentication                        │
│              Dapper Wallet  |  Blocto Wallet                    │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      FLOW BLOCKCHAIN                            │
│  ┌───────────────────────────────────────────────────────┐     │
│  │         RoyaltyTracker Smart Contract (Cadence)       │     │
│  │                                                        │     │
│  │  • RoyaltyRecord Structure                            │     │
│  │  • RoyaltySplit Management                            │     │
│  │  • Tracker Resource (User Storage)                    │     │
│  │  • Event Emissions                                    │     │
│  │                                                        │     │
│  │  Functions:                                           │     │
│  │  ├─ recordRoyalty()                                   │     │
│  │  ├─ createSplit()                                     │     │
│  │  ├─ updateSplit()                                     │     │
│  │  ├─ getRoyaltyRecords()                               │     │
│  │  └─ getRoyaltySplits()                                │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                  │
│  Contract Address: 0xf8d6e0586b0a20c7                          │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API (Optional)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Express.js  │  │  Dune API    │  │  Supabase    │         │
│  │   Routes     │  │  Analytics   │  │   Caching    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### **Tech Stack**
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Blockchain**: Flow Blockchain, Cadence smart contracts
- **Wallet**: Flow Client Library (FCL), Dapper Wallet SDK
- **State Management**: React Hooks, TanStack Query
- **Backend**: Node.js Express (for API endpoints)
- **Database**: Supabase (optional off-chain caching)

### **Smart Contract**
- **Language**: Cadence 1.0
- **Contract Name**: RoyaltyTracker
- **Network**: Flow Emulator (Development) / Flow Testnet (Staging)
- **Contract Address (Emulator)**: `0xf8d6e0586b0a20c7`
- **Developer Wallet**: `0xf8d6e0586b0a20c7`

### **Contract Features**
```cadence
// Core Structures
- RoyaltyRecord: Tracks individual payments
- RoyaltySplit: Manages collaborator percentages
- Tracker Resource: User's personal royalty tracker

// Functions
- recordRoyalty(): Add new royalty payment
- createSplit(): Set up revenue distribution
- updateSplit(): Modify existing splits
- getRoyaltyRecords(): Query all payments
- getRoyaltySplits(): Query all splits
```

---

## 📦 Deployment 

### **Netlify **

-https://creatorstream.netlify.app/

### **Contract Details**

| Property | Value |
|----------|-------|
| **Contract Name** | RoyaltyTracker |
| **Network** | Flow Emulator |
| **Contract Address** | `0xf8d6e0586b0a20c7` |
| **Deployment Transaction** | `39c83feaa0ddc3df1b1d791fae7c65a2f4235d7813bfd6bc6c54c02bebffb34e` |
| **Storage Path** | `/storage/RoyaltyTracker` |
| **Public Path** | `/public/RoyaltyTracker` |

### **Test Transactions**

**Tracker Initialization:**
- Transaction ID: `46dfa450e71449ee3648d2aacabafe52c3d36c745192030bf16a55367d32670f`
- Block Height: 4
- Status: ✅ SEALED

**Sample Royalty Record:**
- Transaction ID: `6a737caecb6be2007047377d82f1742a5bdd462ab990182df130b1fc5e7cb186`
- NFT ID: 12345
- Amount: 15.50 FLOW
- Marketplace: NBA Top Shot
- Status: ✅ SEALED

**Sample Split Creation:**
- Transaction ID: `d134d67e3c7dbfecb9bad9b21956691052a87d19ce1aca2bfda91f2a1d77f975`
- Collaborators: 2
- Distribution: 60% / 40%
- Status: ✅ SEALED

---

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm
- Flow CLI (for contract deployment)
- Git

### **Quick Start**

1. **Clone the repository**
```bash
git clone https://github.com/rohan911438/CreatorStream.git
cd CreatorStream
```

2. **Install dependencies**
```bash
npm install
```

3. **Start Flow Emulator** (in separate terminal)
```bash
cd CreatorSream
flow emulator start
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

### **For Full-Stack Development**
```bash
# Run both frontend and backend
npm run dev:full

# Or run separately
npm run dev      # Frontend only
npm run server   # Backend only
```

---

## 🎮 Usage Guide

### **1. Connect Your Wallet**
- Click "Connect Dapper Wallet" on the landing page
- Authenticate through Dapper Wallet popup
- Your wallet address will be displayed in the dashboard

### **2. Initialize RoyaltyTracker** (First time only)
- Navigate to the dashboard
- Click "Initialize Tracker" button
- Confirm the transaction in your wallet
- Wait for blockchain confirmation

### **3. Record Royalty Payments**
- Go to "Transactions" section
- Click "Record New Royalty"
- Enter details:
  - NFT ID
  - Amount (in FLOW)
  - Marketplace (e.g., NBA Top Shot, NFL All Day)
  - Transaction hash
- Submit and confirm

### **4. Create Royalty Splits**
- Navigate to "Royalty Splits" section
- Click "Create New Split"
- Add collaborators:
  - Wallet addresses
  - Percentage allocation (must sum to 100%)
- Submit and confirm on blockchain

### **5. View Analytics**
- Check "Analytics" page for:
  - Earnings over time charts
  - Marketplace breakdown
  - Top earning NFTs
  - Monthly trends

---

##  Development

### **Project Structure**
```
creator-stream-dash/
├── src/
│   ├── components/
│   │   ├── dashboard/          # Dashboard components
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/
│   │   ├── use-dapper-wallet.ts
│   │   └── use-flow.ts         # Flow blockchain hook
│   ├── lib/
│   │   ├── flow-config.ts      # FCL configuration
│   │   ├── flow-service.ts     # Blockchain service layer
│   │   └── utils.ts
│   └── pages/
│       ├── Landing.tsx
│       └── Dashboard.tsx
├── CreatorSream/               # Flow project
│   ├── cadence/
│   │   ├── contracts/
│   │   │   └── RoyaltyTracker.cdc
│   │   ├── transactions/
│   │   │   ├── initialize_tracker.cdc
│   │   │   ├── record_royalty.cdc
│   │   │   └── create_split.cdc
│   │   └── scripts/
│   │       ├── get_royalty_records.cdc
│   │       └── get_royalty_splits.cdc
│   └── flow.json
├── server/                     # Backend API
│   ├── routes/
│   └── index.js
└── package.json
```

### **Key Files**

**Frontend:**
- `src/lib/flow-service.ts` - Blockchain interaction layer
- `src/hooks/use-flow.ts` - React hook for Flow operations
- `src/lib/flow-config.ts` - FCL configuration

**Smart Contracts:**
- `CreatorSream/cadence/contracts/RoyaltyTracker.cdc` - Main contract
- `CreatorSream/cadence/transactions/` - Transaction templates
- `CreatorSream/cadence/scripts/` - Query scripts

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run server       # Start backend API
npm run dev:full     # Run frontend + backend
```

---

## 🧪 Testing

### **Manual Testing Flow**
```bash
# 1. Deploy contract
cd CreatorSream
flow project deploy --network emulator

# 2. Initialize tracker
flow transactions send ./cadence/transactions/initialize_tracker.cdc \
  --network emulator --signer emulator-account

# 3. Record test royalty
flow transactions send ./cadence/transactions/record_royalty.cdc \
  12345 15.50 0xf8d6e0586b0a20c7 "NBA Top Shot" "0xabc123" \
  --network emulator --signer emulator-account

# 4. Query records
flow scripts execute ./cadence/scripts/get_royalty_records.cdc \
  0xf8d6e0586b0a20c7 --network emulator
```

### **Verified Test Cases**
- ✅ Contract deployment
- ✅ Tracker initialization
- ✅ Royalty recording
- ✅ Split creation (with validation)
- ✅ Split updates
- ✅ Record queries
- ✅ Split queries

---

## 🌐 Deployment

### **Frontend Deployment**
The app can be deployed via:
- **Lovable** (Click Share → Publish)
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder

### **Testnet Deployment**
To deploy to Flow Testnet:

1. **Create testnet account**
```bash
flow accounts create
```

2. **Update flow.json** with testnet account

3. **Deploy contract**
```bash
flow project deploy --network testnet
```

4. **Update contract address** in `src/lib/flow-service.ts`

---

## 🎯 Use Cases

### **For Solo Creators**
- Track royalties from NBA Top Shot moments
- Monitor NFL All Day collectible earnings
- Analyze which NFTs generate most revenue
- Export data for tax purposes

### **For Collaborative Projects**
- Split royalties among team members automatically
- Transparent distribution (everyone sees the same data)
- Update splits as team composition changes
- Historical record of all distributions

### **For Marketplace Operators**
- Integration-ready API for automated royalty reporting
- On-chain verification of payments
- Reduced support tickets about missing payments

---

## 🔮 Future Roadmap

### **Phase 1** (Current)
- ✅ Core royalty tracking
- ✅ Manual payment recording
- ✅ Split management
- ✅ Basic analytics

### **Phase 2** (Next)
- [ ] Automated marketplace integrations (NBA Top Shot API)
- [ ] Direct payout execution via smart contracts
- [ ] Mobile app (React Native)
- [ ] Multi-chain support

### **Phase 3** (Future)
- [ ] Creator DAOs with governance
- [ ] Royalty NFTs (tradeable revenue shares)
- [ ] AI-powered royalty predictions
- [ ] Tax report generation

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👥 Team

**Team BROTHERHOOD**

**Rohan Kumar** - Full-Stack Developer & Blockchain Engineer
- GitHub: [@rohan911438](https://github.com/rohan911438)
- Email: 123131rkorohan@gmail.com
- Role: Architecture, Smart Contracts, Frontend, Flow Integration

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Forte / Flow Team** for the amazing blockchain infrastructure
- **Dapper Labs** for Dapper Wallet and NBA Top Shot inspiration
- **Forte Hacks** for organizing this hackathon
- **shadcn** for the beautiful UI components
- **Flow Community** for excellent documentation

---

## 📞 Contact & Support

- **Email**: 123131rkorohan@gmail.com
- **GitHub Issues**: https://github.com/rohan911438/CreatorStream/issues
- **Discord**: [Join our community](#)

---

## 🔗 Important Links

- **Repository**: https://github.com/rohan911438/CreatorStream
- **Flow Documentation**: https://docs.onflow.org/
- **Cadence Language**: https://cadence-lang.org/
- **Dapper Wallet**: https://www.meetdapper.com/
- **Forte Platform**: https://forte.io/

---

<div align="center">

**Built with ❤️ for Forte Hacks 2025**

**Powered by Flow Blockchain 🌊 | Secured by Dapper Wallet 🔐**

[⭐ Star this repo](https://github.com/rohan911438/CreatorStream) | [🐛 Report Bug](https://github.com/rohan911438/CreatorStream/issues) | [💡 Request Feature](https://github.com/rohan911438/CreatorStream/issues)

</div>

---

© 2025 CreatorStream by Team BROTHERHOOD. All rights reserved.

