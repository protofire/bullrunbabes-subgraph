import { ethereum, Address } from "@graphprotocol/graph-ts"
import { test, assert, clearStore, newMockEvent } from "matchstick-as/assembly/index"
import { Paused, Unpaused } from "../../generated/BullrunBabesToken/BullrunBabesToken";
import { handlePaused, handleUnpaused } from "../mappings/token";
import { stats } from "../modules/stats"
import { log } from "matchstick-as"

export function runPauseTests() :void {
    
    test("Pause test", () => {
        let account = "0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f7"
        let statsInstance = stats.getOrCreateStats()

        let statsId = statsInstance.id.toString()
        let statsIsPaused = statsInstance.isPaused.toString()
        log.warning("statsId: {}", [statsId])
        log.warning("isPaused: {}", [statsIsPaused])

        //assert.fieldEquals("BullrunBabesStat ", statsId, "isPaused", "false")

        let mockEvent = newMockEvent();
        let newPausedEvent = new Paused(
            mockEvent.address, 
            mockEvent.logIndex, 
            mockEvent.transactionLogIndex, 
            mockEvent.logType,
            mockEvent.block, 
            mockEvent.transaction, 
            mockEvent.parameters)
        
        newPausedEvent.parameters = new Array()
        let accountParam = new ethereum.EventParam("account", 
            ethereum.Value.fromAddress(Address.fromString(account)))
        let blockTimestamp = newPausedEvent.block.timestamp.toString()

        newPausedEvent.parameters.push(accountParam)

        handlePaused(newPausedEvent)

        assert.fieldEquals("Account", account, "id", account)
        assert.fieldEquals("BullrunBabesStat", "current", "id", "current")
        assert.fieldEquals("BullrunBabesStat", "current", "isPaused", "true")
        assert.fieldEquals("BullrunBabesStat", "current", "lastPauser", account)
        assert.fieldEquals("BullrunBabesStat", "current", "lastPauseDate", blockTimestamp)
        
        clearStore()
    })

    test("Unpause test", () => {
        let account = "0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f7"
        let statsInstance = stats.getOrCreateStats()

        let mockEvent = newMockEvent();
        let newUnpausedEvent = new Unpaused(
            mockEvent.address, 
            mockEvent.logIndex, 
            mockEvent.transactionLogIndex, 
            mockEvent.logType,
            mockEvent.block, 
            mockEvent.transaction, 
            mockEvent.parameters)
        
        newUnpausedEvent.parameters = new Array()
        let accountParam = new ethereum.EventParam("account", 
            ethereum.Value.fromAddress(Address.fromString(account)))
        let blockTimestamp = newUnpausedEvent.block.timestamp.toString()

        newUnpausedEvent.parameters.push(accountParam)

        handleUnpaused(newUnpausedEvent)

        assert.fieldEquals("Account", account, "id", account)
        assert.fieldEquals("BullrunBabesStat", "current", "id", "current")
        assert.fieldEquals("BullrunBabesStat", "current", "isPaused", "false")
        assert.fieldEquals("BullrunBabesStat", "current", "lastUnpauser", account)
        assert.fieldEquals("BullrunBabesStat", "current", "lastUnpauseDate", blockTimestamp)
        
        clearStore()
    })
}