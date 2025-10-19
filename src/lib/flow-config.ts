import * as fcl from "@onflow/fcl";

// Configure Flow for Dapper Wallet
fcl.config({
  "accessNode.api": "https://rest-mainnet.onflow.org", // Mainnet
  // "accessNode.api": "https://rest-testnet.onflow.org", // Testnet
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn", // Dapper Wallet Discovery
  "app.detail.title": "CreatorStream",
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "app.detail.description": "Automate and track your NFT royalties with ease",
});

export { fcl };
