// Record Royalty Payment
// Records a new royalty payment in the tracker

import RoyaltyTracker from "../contracts/RoyaltyTracker.cdc"

transaction(
    nftID: UInt64,
    amount: UFix64,
    recipient: Address,
    marketplace: String,
    transactionHash: String
) {
    
    let trackerRef: &RoyaltyTracker.Tracker

    prepare(signer: auth(Storage) &Account) {
        // Get reference to tracker
        self.trackerRef = signer.storage.borrow<&RoyaltyTracker.Tracker>(
            from: RoyaltyTracker.RoyaltyTrackerStoragePath
        ) ?? panic("Could not borrow tracker reference")
    }

    execute {
        // Record the royalty
        let recordID = self.trackerRef.recordRoyalty(
            nftID: nftID,
            amount: amount,
            recipient: recipient,
            marketplace: marketplace,
            transactionHash: transactionHash
        )
        
        log("Royalty recorded with ID: ".concat(recordID.toString()))
    }
}
