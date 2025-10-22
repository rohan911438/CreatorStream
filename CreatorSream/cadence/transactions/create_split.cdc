// Create Royalty Split
// Creates a new royalty split configuration for an NFT

import RoyaltyTracker from "../contracts/RoyaltyTracker.cdc"

transaction(
    nftID: UInt64,
    collaborators: [Address],
    percentages: [UFix64]
) {
    
    let trackerRef: &RoyaltyTracker.Tracker

    prepare(signer: auth(Storage) &Account) {
        // Get reference to tracker
        self.trackerRef = signer.storage.borrow<&RoyaltyTracker.Tracker>(
            from: RoyaltyTracker.RoyaltyTrackerStoragePath
        ) ?? panic("Could not borrow tracker reference")
    }

    execute {
        // Create the split
        let splitID = self.trackerRef.createSplit(
            nftID: nftID,
            collaborators: collaborators,
            percentages: percentages
        )
        
        log("Royalty split created with ID: ".concat(splitID.toString()))
    }
}
