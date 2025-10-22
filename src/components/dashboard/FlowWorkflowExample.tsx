// Flow Workflow Example Component
// Demonstrates how to use the Flow blockchain workflow

import { useState, useEffect } from "react";
import { useFlow } from "@/hooks/use-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function FlowWorkflowExample() {
  const {
    isLoading,
    error,
    isConnected,
    address,
    initialize,
    addRoyaltyRecord,
    addSplit,
    fetchRoyaltyRecords,
    fetchRoyaltySplits,
    checkTracker,
  } = useFlow();

  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [splits, setSplits] = useState<any[]>([]);

  // Check if tracker is initialized on mount
  useEffect(() => {
    const check = async () => {
      if (isConnected && address) {
        const initialized = await checkTracker();
        setIsInitialized(initialized);
      }
    };
    check();
  }, [isConnected, address, checkTracker]);

  // Initialize tracker
  const handleInitialize = async () => {
    const result = await initialize();
    if (result.success) {
      toast({
        title: "Success!",
        description: "RoyaltyTracker initialized successfully",
      });
      setIsInitialized(true);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to initialize tracker",
        variant: "destructive",
      });
    }
  };

  // Record a sample royalty
  const handleRecordRoyalty = async () => {
    const result = await addRoyaltyRecord(
      12345, // NFT ID
      15.5, // Amount
      address!, // Recipient
      "NBA Top Shot", // Marketplace
      `0x${Date.now().toString(16)}` // Sample transaction hash
    );

    if (result.success) {
      toast({
        title: "Royalty Recorded!",
        description: `Transaction ID: ${result.txId}`,
      });
      loadRecords();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to record royalty",
        variant: "destructive",
      });
    }
  };

  // Create a sample split
  const handleCreateSplit = async () => {
    // Example: 50-30-20 split between 3 collaborators
    const collaborators = [
      address!, // Main creator
      "0x01cf0e2f2f715450", // Collaborator 1
      "0x179b6b1cb6755e31", // Collaborator 2
    ];
    const percentages = [50.0, 30.0, 20.0];

    const result = await addSplit(12345, collaborators, percentages);

    if (result.success) {
      toast({
        title: "Split Created!",
        description: `Transaction ID: ${result.txId}`,
      });
      loadSplits();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create split",
        variant: "destructive",
      });
    }
  };

  // Load records
  const loadRecords = async () => {
    const data = await fetchRoyaltyRecords();
    setRecords(data);
  };

  // Load splits
  const loadSplits = async () => {
    const data = await fetchRoyaltySplits();
    setSplits(data);
  };

  // Load data on mount
  useEffect(() => {
    if (isConnected && isInitialized) {
      loadRecords();
      loadSplits();
    }
  }, [isConnected, isInitialized]);

  if (!isConnected) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please connect your wallet to use Flow blockchain features
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Flow Blockchain Workflow</CardTitle>
          <CardDescription>
            Manage your NFT royalties on the Flow blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Connected: {address?.slice(0, 8)}...{address?.slice(-6)}</span>
          </div>

          {/* Initialization */}
          {!isInitialized ? (
            <div className="space-y-2">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  First time setup required. Initialize your RoyaltyTracker to get started.
                </AlertDescription>
              </Alert>
              <Button onClick={handleInitialize} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Initialize Tracker
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={handleRecordRoyalty} disabled={isLoading} variant="default">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Record Sample Royalty
                </Button>
                <Button onClick={handleCreateSplit} disabled={isLoading} variant="outline">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Sample Split
                </Button>
                <Button onClick={loadRecords} disabled={isLoading} variant="ghost">
                  Refresh Data
                </Button>
              </div>

              {/* Royalty Records */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Royalty Records ({records.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {records.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No royalty records yet</p>
                  ) : (
                    <div className="space-y-2">
                      {records.map((record, i) => (
                        <div key={i} className="text-sm border-b pb-2">
                          <div className="flex justify-between">
                            <span>NFT #{record.nftID}</span>
                            <span className="font-semibold">{record.amount} FLOW</span>
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {record.marketplace} • {new Date(parseFloat(record.timestamp) * 1000).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Royalty Splits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Royalty Splits ({splits.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {splits.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No royalty splits configured</p>
                  ) : (
                    <div className="space-y-2">
                      {splits.map((split, i) => (
                        <div key={i} className="text-sm border-b pb-2">
                          <div className="font-semibold">NFT #{split.nftID}</div>
                          <div className="space-y-1 mt-1">
                            {split.collaborators.map((addr: string, j: number) => (
                              <div key={j} className="flex justify-between text-xs">
                                <span className="text-muted-foreground">{addr.slice(0, 8)}...{addr.slice(-6)}</span>
                                <span>{split.percentages[j]}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
