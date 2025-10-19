# CreatorStream - Dapper Wallet Integration Guide

## Overview
CreatorStream now features full Dapper Wallet integration for the Forte Hacks hackathon! Connect your Dapper Wallet to access the platform and manage your NFT royalties on the Flow blockchain.

## Features Added

### 🎨 Enhanced Landing Page
- **Modern Hero Section** with animated gradient backgrounds and pulsing effects
- **Framer Motion Animations** for smooth, professional transitions
- **Responsive Design** optimized for all screen sizes
- **Interactive Stats Cards** showing platform metrics
- **Feature Showcase** with 6 detailed feature cards
- **Benefits Section** highlighting platform advantages
- **Partner Logos** featuring Flow, Dapper, NBA Top Shot, and NFL All Day

### 💎 Dapper Wallet Integration
- **One-Click Connection** using Flow Client Library (FCL)
- **Persistent Authentication** - wallet state maintained across page refreshes
- **Account Display** - shows connected wallet address (truncated)
- **Easy Disconnect** - simple logout functionality
- **Toast Notifications** for connection status
- **Conditional Rendering** - different CTAs based on wallet connection status

## Technical Stack

### New Dependencies
- `@onflow/fcl` - Flow Client Library for blockchain interactions
- `framer-motion` - Advanced animations and transitions

### New Files Created
- `src/lib/flow-config.ts` - Flow blockchain configuration
- `src/lib/dapper-wallet.ts` - Dapper Wallet service functions

### Modified Files
- `src/pages/Landing.tsx` - Completely redesigned landing page
- `src/index.css` - Added custom animations

## How to Use

### For Users
1. Visit the landing page
2. Click "Connect Dapper Wallet"
3. Authenticate through the Dapper Wallet popup
4. Once connected, access the Dashboard
5. Disconnect anytime using the "Disconnect" button

### For Developers

#### Running the Project
```bash
npm install
npm run dev
```

#### Configuring Flow Network
Edit `src/lib/flow-config.ts` to switch between mainnet and testnet:

```typescript
fcl.config({
  "accessNode.api": "https://rest-mainnet.onflow.org", // Mainnet
  // "accessNode.api": "https://rest-testnet.onflow.org", // Testnet
  //...
});
```

#### Using Dapper Wallet Functions

```typescript
import { login, logout, subscribeToAuth } from "@/lib/dapper-wallet";

// Connect wallet
await login();

// Disconnect wallet
await logout();

// Listen to auth changes
const unsubscribe = subscribeToAuth((user) => {
  console.log("User:", user);
});
```

## Design Features

### Animations
- **Gradient Shift** - Animated background gradient on hero title
- **Pulse Effects** - Glowing orbs in the background
- **Hover Transforms** - Cards scale up on hover
- **Staggered Entry** - Elements fade in sequentially
- **Scroll Triggers** - Animations trigger when sections come into view

### Color Scheme
- Primary: Purple (`hsl(263 70% 50%)`)
- Secondary: Pink (`hsl(280 60% 60%)`)
- Accent: Hot Pink (`hsl(330 80% 60%)`)
- Background: Dark (`hsl(240 10% 3.9%)`)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Forte Hacks Integration

This project is built for the **Forte Hacks** hackathon with the following integrations:

1. **Flow Blockchain** - Decentralized backend for NFT royalties
2. **Dapper Wallet** - User authentication and transaction signing
3. **Smart Contracts** - Automated royalty distribution (backend integration ready)
4. **Real-time Dashboard** - Track earnings and manage collaborators

## Next Steps

### Recommended Enhancements
1. Deploy actual Flow smart contracts for royalty splits
2. Integrate with NBA Top Shot and NFL All Day APIs
3. Add transaction history fetching from Flow blockchain
4. Implement collaborative split management
5. Add multi-sig wallet support
6. Create admin panel for managing splits

### Smart Contract Integration
```cadence
// Example: Create a royalty split contract
pub contract RoyaltySplitter {
    pub resource Split {
        pub let collaborators: {Address: UFix64}
        
        init(collaborators: {Address: UFix64}) {
            self.collaborators = collaborators
        }
    }
}
```

## Troubleshooting

### Wallet Won't Connect
- Ensure you have Dapper Wallet browser extension installed
- Check that you're on a supported network (mainnet/testnet)
- Clear browser cache and try again

### Animations Not Working
- Ensure Framer Motion is properly installed
- Check browser console for errors
- Verify `prefers-reduced-motion` is not enabled

### Styling Issues
- Run `npm run dev` to ensure Tailwind is compiling
- Check that all CSS variables are defined in `index.css`

## Credits

Built with ❤️ for Forte Hacks using:
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Flow Blockchain
- Dapper Wallet

---

**For support or questions about this integration, please contact the team or refer to the [Flow Documentation](https://docs.onflow.org/).**
