import { useState, useEffect } from "react";
import { subscribeToAuth, login, logout } from "@/lib/dapper-wallet";
import type { CurrentUser } from "@onflow/fcl";

export const useDapperWallet = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    try {
      await login();
      return { success: true };
    } catch (error) {
      console.error("Connection error:", error);
      return { success: false, error };
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await logout();
      return { success: true };
    } catch (error) {
      console.error("Disconnection error:", error);
      return { success: false, error };
    }
  };

  return {
    user,
    isConnected: user?.loggedIn ?? false,
    isConnecting,
    isLoading,
    address: user?.addr,
    connect,
    disconnect,
  };
};
