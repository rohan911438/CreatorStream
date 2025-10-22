import * as fcl from "@onflow/fcl";

// Configure Flow for Dapper Wallet
fcl.config({
  // Emulator configuration (for local testing)
  "accessNode.api": "http://127.0.0.1:8888", // Flow Emulator
  "discovery.wallet": "http://localhost:8701/fcl/authn", // Emulator wallet
  
  // Uncomment for Testnet
  // "accessNode.api": "https://rest-testnet.onflow.org",
  // "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  
  // Uncomment for Mainnet
  // "accessNode.api": "https://rest-mainnet.onflow.org",
  // "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
  
  "app.detail.title": "CreatorStream",
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "app.detail.description": "Automate and track your NFT royalties with ease",
});

export { fcl };
