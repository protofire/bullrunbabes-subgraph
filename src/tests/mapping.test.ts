import { ethereum } from "@graphprotocol/graph-ts"
import { test, assert, clearStore, newMockEvent } from "matchstick-as/assembly/index"
import { log } from "matchstick-as/assembly/"
import { CardAllocated } from "../../generated/BullrunBabesCoordinator/BullrunBabesCoordinator"

import { Card } from "../../generated/schema"
import { handleCardAllocated } from "../mapping"

export function runTests() :void {
    test( "simpletest", () => {
        assert.assertTrue(true)
        clearStore()
    })

    test("not so simple", () => {
        let mockEvent = newMockEvent();
        let newCardAllocatedEvent = new CardAllocated(
            mockEvent.address, 
            mockEvent.logIndex, 
            mockEvent.transactionLogIndex, 
            mockEvent.logType,
            mockEvent.block, 
            mockEvent.transaction, 
            mockEvent.parameters)
        
        newCardAllocatedEvent.parameters = []
        let tokenIdParam = new ethereum.EventParam("tokenId", ethereum.Value.fromI32(0))
        newCardAllocatedEvent.parameters.push(tokenIdParam)

        log.debug("This is ok", [])

        handleCardAllocated(newCardAllocatedEvent)

        log.debug("can not log this", [])

        assert.fieldEquals("Card", "0x0", "id", "0x33")
        clearStore()
    })
}