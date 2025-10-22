// RoyaltyTracker Contract
// Tracks NFT royalty payments and splits for creators

access(all) contract RoyaltyTracker {
    
    // Events
    access(all) event RoyaltyRecorded(nftID: UInt64, amount: UFix64, recipient: Address, timestamp: UFix64)
    access(all) event SplitCreated(splitID: UInt64, nftID: UInt64, collaborators: [Address], percentages: [UFix64])
    access(all) event SplitUpdated(splitID: UInt64, collaborators: [Address], percentages: [UFix64])
    access(all) event PayoutExecuted(splitID: UInt64, totalAmount: UFix64, timestamp: UFix64)

    // Paths
    access(all) let RoyaltyTrackerStoragePath: StoragePath
    access(all) let RoyaltyTrackerPublicPath: PublicPath

    // Helper function to validate percentages
    access(all) view fun validatePercentages(_ percentages: [UFix64]): Bool {
        var total: UFix64 = 0.0
        for percentage in percentages {
            total = total + percentage
        }
        return total == 100.0
    }

    // Royalty Record
    access(all) struct RoyaltyRecord {
        access(all) let id: UInt64
        access(all) let nftID: UInt64
        access(all) let amount: UFix64
        access(all) let recipient: Address
        access(all) let marketplace: String
        access(all) let timestamp: UFix64
        access(all) let transactionHash: String

        init(
            id: UInt64,
            nftID: UInt64,
            amount: UFix64,
            recipient: Address,
            marketplace: String,
            timestamp: UFix64,
            transactionHash: String
        ) {
            self.id = id
            self.nftID = nftID
            self.amount = amount
            self.recipient = recipient
            self.marketplace = marketplace
            self.timestamp = timestamp
            self.transactionHash = transactionHash
        }
    }

    // Royalty Split
    access(all) struct RoyaltySplit {
        access(all) let id: UInt64
        access(all) let nftID: UInt64
        access(all) var collaborators: [Address]
        access(all) var percentages: [UFix64]
        access(all) let createdAt: UFix64
        access(all) var updatedAt: UFix64

        init(id: UInt64, nftID: UInt64, collaborators: [Address], percentages: [UFix64]) {
            pre {
                collaborators.length == percentages.length: "Collaborators and percentages must match"
                RoyaltyTracker.validatePercentages(percentages): "Percentages must sum to 100.0"
            }
            self.id = id
            self.nftID = nftID
            self.collaborators = collaborators
            self.percentages = percentages
            self.createdAt = getCurrentBlock().timestamp
            self.updatedAt = getCurrentBlock().timestamp
        }

        access(all) fun updateSplit(collaborators: [Address], percentages: [UFix64]) {
            pre {
                collaborators.length == percentages.length: "Collaborators and percentages must match"
                RoyaltyTracker.validatePercentages(percentages): "Percentages must sum to 100.0"
            }
            self.collaborators = collaborators
            self.percentages = percentages
            self.updatedAt = getCurrentBlock().timestamp
        }
    }

    // Tracker Resource
    access(all) resource Tracker {
        access(all) var royaltyRecords: {UInt64: RoyaltyRecord}
        access(all) var royaltySplits: {UInt64: RoyaltySplit}
        access(all) var nextRecordID: UInt64
        access(all) var nextSplitID: UInt64

        init() {
            self.royaltyRecords = {}
            self.royaltySplits = {}
            self.nextRecordID = 1
            self.nextSplitID = 1
        }

        access(all) fun recordRoyalty(
            nftID: UInt64,
            amount: UFix64,
            recipient: Address,
            marketplace: String,
            transactionHash: String
        ): UInt64 {
            let record = RoyaltyRecord(
                id: self.nextRecordID,
                nftID: nftID,
                amount: amount,
                recipient: recipient,
                marketplace: marketplace,
                timestamp: getCurrentBlock().timestamp,
                transactionHash: transactionHash
            )
            
            self.royaltyRecords[self.nextRecordID] = record
            emit RoyaltyRecorded(
                nftID: nftID,
                amount: amount,
                recipient: recipient,
                timestamp: getCurrentBlock().timestamp
            )
            
            let recordID = self.nextRecordID
            self.nextRecordID = self.nextRecordID + 1
            return recordID
        }

        access(all) fun createSplit(nftID: UInt64, collaborators: [Address], percentages: [UFix64]): UInt64 {
            let split = RoyaltySplit(
                id: self.nextSplitID,
                nftID: nftID,
                collaborators: collaborators,
                percentages: percentages
            )
            
            self.royaltySplits[self.nextSplitID] = split
            emit SplitCreated(
                splitID: self.nextSplitID,
                nftID: nftID,
                collaborators: collaborators,
                percentages: percentages
            )
            
            let splitID = self.nextSplitID
            self.nextSplitID = self.nextSplitID + 1
            return splitID
        }

        access(all) fun updateSplit(splitID: UInt64, collaborators: [Address], percentages: [UFix64]) {
            pre {
                self.royaltySplits[splitID] != nil: "Split does not exist"
            }
            
            self.royaltySplits[splitID]!.updateSplit(
                collaborators: collaborators,
                percentages: percentages
            )
            
            emit SplitUpdated(
                splitID: splitID,
                collaborators: collaborators,
                percentages: percentages
            )
        }

        access(all) fun getRoyaltyRecords(): [RoyaltyRecord] {
            return self.royaltyRecords.values
        }

        access(all) fun getRoyaltySplits(): [RoyaltySplit] {
            return self.royaltySplits.values
        }

        access(all) fun getSplitByNFTID(nftID: UInt64): RoyaltySplit? {
            for split in self.royaltySplits.values {
                if split.nftID == nftID {
                    return split
                }
            }
            return nil
        }

        access(all) fun getRoyaltiesByNFT(nftID: UInt64): [RoyaltyRecord] {
            let records: [RoyaltyRecord] = []
            for record in self.royaltyRecords.values {
                if record.nftID == nftID {
                    records.append(record)
                }
            }
            return records
        }
    }

    // Public Interface
    access(all) resource interface TrackerPublic {
        access(all) fun getRoyaltyRecords(): [RoyaltyRecord]
        access(all) fun getRoyaltySplits(): [RoyaltySplit]
        access(all) fun getSplitByNFTID(nftID: UInt64): RoyaltySplit?
        access(all) fun getRoyaltiesByNFT(nftID: UInt64): [RoyaltyRecord]
    }

    access(all) fun createTracker(): @Tracker {
        return <- create Tracker()
    }

    init() {
        self.RoyaltyTrackerStoragePath = /storage/RoyaltyTracker
        self.RoyaltyTrackerPublicPath = /public/RoyaltyTracker
    }
}
