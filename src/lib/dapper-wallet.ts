import { fcl } from "./flow-config";
import type { CurrentUser } from "@onflow/fcl";

export interface User {
  addr?: string | null;
  loggedIn?: boolean;
}

// Subscribe to authentication state
export const subscribeToAuth = (callback: (user: CurrentUser) => void) => {
  return fcl.currentUser.subscribe(callback);
};

// Login with Dapper Wallet
export const login = async () => {
  try {
    await fcl.authenticate();
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await fcl.unauthenticate();
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  return fcl.currentUser.snapshot();
};
