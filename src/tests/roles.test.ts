import { ethereum, Bytes, BigInt} from "@graphprotocol/graph-ts"
import { test, assert, clearStore, newMockEvent } from "matchstick-as/assembly/index"
import { RoleGranted } from "../../generated/BullrunBabesToken/BullrunBabesToken"

export function runRolesTests() :void {
    test( "simple Roles test", () => {
        assert.assertTrue(true)
        clearStore()
    })

    // let role = event.params.role.toHex()
	// let accountId = event.params.account
	// let senderId = event.params.sender
	// let timestamp = event.block.timestamp

    test("Role granted test", () => {
        let DEFAULT_HASH = "0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f6"
        let mockEvent = newMockEvent()
        let newTransferEvent = new RoleGranted(
            mockEvent.address, 
            mockEvent.logIndex, 
            mockEvent.transactionLogIndex, 
            mockEvent.logType,
            mockEvent.block, 
            mockEvent.transaction, 
            mockEvent.parameters
        )
       
        newTransferEvent.parameters = new Array()
        let roleParam = new ethereum.EventParam("role", ethereum.Value.fromBytes(Bytes.fromHexString(DEFAULT_HASH) as Bytes))

    })
}