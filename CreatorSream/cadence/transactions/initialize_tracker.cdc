// Initialize Royalty Tracker
// Sets up the RoyaltyTracker resource in the user's account

import RoyaltyTracker from "../contracts/RoyaltyTracker.cdc"

transaction {
    
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Check if tracker already exists
        if signer.storage.borrow<&RoyaltyTracker.Tracker>(from: RoyaltyTracker.RoyaltyTrackerStoragePath) == nil {
            // Create and save tracker
            let tracker <- RoyaltyTracker.createTracker()
            signer.storage.save(<-tracker, to: RoyaltyTracker.RoyaltyTrackerStoragePath)
            
            // Create public capability
            let cap = signer.capabilities.storage.issue<&RoyaltyTracker.Tracker>(
                RoyaltyTracker.RoyaltyTrackerStoragePath
            )
            signer.capabilities.publish(cap, at: RoyaltyTracker.RoyaltyTrackerPublicPath)
        }
    }

    execute {
        log("RoyaltyTracker initialized successfully")
    }
}
