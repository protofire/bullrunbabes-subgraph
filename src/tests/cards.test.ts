import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import { test, assert, clearStore, newMockEvent } from "matchstick-as/assembly/index"
import { CardAllocated } from "../../generated/BullrunBabesCoordinator/BullrunBabesCoordinator"

import { handleCardAllocated } from "../mappings/cards"

export function runCardsTests() :void {
    
    test("Card creation and property checking", () => {
        let mockEvent = newMockEvent();
        let newCardAllocatedEvent = new CardAllocated(
            mockEvent.address, 
            mockEvent.logIndex, 
            mockEvent.transactionLogIndex, 
            mockEvent.logType,
            mockEvent.block, 
            mockEvent.transaction, 
            mockEvent.parameters)
        
        newCardAllocatedEvent.parameters = new Array()
        let ownerParam = new ethereum.EventParam("owner", 
            ethereum.Value.fromAddress(Address.fromString("0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f7")))
        let tokenIdParam = new ethereum.EventParam("tokenId", ethereum.Value.fromI32(0))
        let serialParam = new ethereum.EventParam("serial", ethereum.Value.fromI32(1))
        let cardTypeIdParam = new ethereum.EventParam("cardTypeId", ethereum.Value.fromI32(2))
        let tierParam = new ethereum.EventParam("tier", ethereum.Value.fromI32(3))
        let cidParam = new ethereum.EventParam("cid", ethereum.Value.fromString("4"))
        let queryIdParam = new ethereum.EventParam("queryId", ethereum.Value.fromBytes(Bytes.fromHexString("010101") as Bytes))

        newCardAllocatedEvent.parameters.push(ownerParam)
        newCardAllocatedEvent.parameters.push(tokenIdParam)
        newCardAllocatedEvent.parameters.push(serialParam)
        newCardAllocatedEvent.parameters.push(cardTypeIdParam)
        newCardAllocatedEvent.parameters.push(tierParam)
        newCardAllocatedEvent.parameters.push(cidParam)
        newCardAllocatedEvent.parameters.push(queryIdParam)

        handleCardAllocated(newCardAllocatedEvent)

        assert.fieldEquals("Card", "0", "id", "0")
        assert.fieldEquals("Card", "0", "tokenId", "0")
        assert.fieldEquals("Card", "0", "owner", "0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f7")
        assert.fieldEquals("Card", "0", "serial", "1")
        assert.fieldEquals("Card", "0", "cardTypeId", "2")
        assert.fieldEquals("Card", "0", "tier", "3")
        assert.fieldEquals("Card", "0", "cid", "4")
        assert.fieldEquals("Card", "0", "queryId", "0x010101")
        
        clearStore()
    })
}