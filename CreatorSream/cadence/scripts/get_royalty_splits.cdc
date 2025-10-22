// Get All Royalty Splits
// Retrieves all royalty splits from a user's tracker

import RoyaltyTracker from "../contracts/RoyaltyTracker.cdc"

access(all) fun main(address: Address): [RoyaltyTracker.RoyaltySplit] {
    let account = getAccount(address)
    
    let trackerCap = account.capabilities.get<&RoyaltyTracker.Tracker>(
        RoyaltyTracker.RoyaltyTrackerPublicPath
    )
    
    let trackerRef = trackerCap.borrow()
        ?? panic("Could not borrow tracker reference")
    
    return trackerRef.getRoyaltySplits()
}
