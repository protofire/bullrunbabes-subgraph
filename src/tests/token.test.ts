import { ethereum, Address, BigInt} from "@graphprotocol/graph-ts"
import { test, assert, clearStore, newMockEvent } from "matchstick-as/assembly/index"
import { Approval, ApprovalForAll, Transfer } from "../../generated/BullrunBabesToken/BullrunBabesToken"
import { handleApproval, handleTransfer, handleApprovalForAll } from "../mappings/token"
import { ZERO_ADDRESS } from '@protofire/subgraph-toolkit'
import { log } from "matchstick-as"
import { Token } from "../../generated/schema"
import { runTransactionsTests } from "./transactions.test"
import { runRolesTests } from "./roles.test"

export function runTokenTests() :void {

    log.info("Running Transaction Tests", [])
    runTransactionsTests()
    runRolesTests()

    test("Handle approval event test", () => {
        let tokenId = BigInt.fromI32(33)
        let ADDRESS1 = "0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f7"
        let ADDRESS2 = "0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f6"
        let mockEvent = newMockEvent()
        let newApprovalEvent = new Approval(
            mockEvent.address, 
            mockEvent.logIndex, 
            mockEvent.transactionLogIndex, 
            mockEvent.logType,
            mockEvent.block, 
            mockEvent.transaction, 
            mockEvent.parameters
        )
       
        // import helopers and uncomment this newApprovalEvent =  helpers.getEventFromMock(Approval)
        newApprovalEvent.parameters = new Array()

        let tokenParam = new ethereum.EventParam("tokenId", ethereum.Value.fromI32(tokenId.toI32()))
        let ownerParam = new ethereum.EventParam("owner", 
        ethereum.Value.fromAddress(Address.fromString(ADDRESS1)))
        let addressParam = new ethereum.EventParam("approved", 
        ethereum.Value.fromAddress(Address.fromString(ADDRESS2)))
        
        newApprovalEvent.parameters.push(ownerParam)
        newApprovalEvent.parameters.push(addressParam)
        newApprovalEvent.parameters.push(tokenParam)

        let token = new Token(tokenId.toHex())
        token.approval = ""
        token.save()

        handleApproval(newApprovalEvent)
        
        assert.fieldEquals("Account", ADDRESS1, "id", ADDRESS1)
        assert.fieldEquals("Account", ADDRESS1, "address", ADDRESS1)
        assert.fieldEquals("Account", ADDRESS2, "id", ADDRESS2)
        assert.fieldEquals("Account", ADDRESS2, "address", ADDRESS2)
        assert.fieldEquals("Token", tokenId.toHex(), "id", tokenId.toHex())
        assert.fieldEquals("Token", tokenId.toHex(), "approval", ADDRESS2)
         
        clearStore()
    }) 

    test("Handle approvalForAll event test", () => {
        let tokenId = BigInt.fromI32(33)
        let ownerAddress = "0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f7"
        let operatorAddress = "0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f6"
        let mockEvent = newMockEvent()
        let newApprovalForAllEvent = new ApprovalForAll(
            mockEvent.address, 
            mockEvent.logIndex, 
            mockEvent.transactionLogIndex, 
            mockEvent.logType,
            mockEvent.block, 
            mockEvent.transaction, 
            mockEvent.parameters
        )
       
        // import helopers and uncomment this newApprovalEvent =  helpers.getEventFromMock(Approval)
        newApprovalForAllEvent.parameters = new Array()

        let approvedParam = new ethereum.EventParam("approved", ethereum.Value.fromBoolean(true))
        let ownerParam = new ethereum.EventParam("owner", 
        ethereum.Value.fromAddress(Address.fromString(ownerAddress)))
        let operatorParam = new ethereum.EventParam("operator", 
        ethereum.Value.fromAddress(Address.fromString(operatorAddress)))
        
        newApprovalForAllEvent.parameters.push(ownerParam)
        newApprovalForAllEvent.parameters.push(operatorParam)
        newApprovalForAllEvent.parameters.push(approvedParam)

        handleApprovalForAll(newApprovalForAllEvent)

        let operatorOwnerId = ownerAddress + "-" + operatorAddress
        
        assert.fieldEquals("Account", ownerAddress, "id", ownerAddress)
        assert.fieldEquals("Account", ownerAddress, "address", ownerAddress)
        assert.fieldEquals("Account", operatorAddress, "id", operatorAddress)
        assert.fieldEquals("Account", operatorAddress, "address", operatorAddress)
        assert.fieldEquals("OperatorOwner", operatorOwnerId, "id", operatorOwnerId)
        assert.fieldEquals("OperatorOwner", operatorOwnerId, "owner", ownerAddress)
        assert.fieldEquals("OperatorOwner", operatorOwnerId, "operator", operatorAddress)
        assert.fieldEquals("OperatorOwner", operatorOwnerId, "approved", "true")
         
        clearStore()
    }) 

    test("Handle transfer event - block data test", () => {
        let tokenId = BigInt.fromI32(44)
        let from = ZERO_ADDRESS
        let to = "0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f6"
        let mockEvent = newMockEvent()
        let newTransferEvent = new Transfer(
            mockEvent.address, 
            mockEvent.logIndex, 
            mockEvent.transactionLogIndex, 
            mockEvent.logType,
            mockEvent.block, 
            mockEvent.transaction, 
            mockEvent.parameters
        )
       
        newTransferEvent.parameters = new Array()

        let tokenParam = new ethereum.EventParam("tokenId", ethereum.Value.fromI32(tokenId.toI32()))
        let fromParam = new ethereum.EventParam("owner", 
        ethereum.Value.fromAddress(Address.fromString(from)))
        let toParam = new ethereum.EventParam("approved", 
        ethereum.Value.fromAddress(Address.fromString(to)))
        
        newTransferEvent.parameters.push(fromParam)
        newTransferEvent.parameters.push(toParam)
        newTransferEvent.parameters.push(tokenParam)

        handleTransfer(newTransferEvent)

        let blockId = newTransferEvent.block.number.toString()
        let timestamp = newTransferEvent.block.timestamp.toString()
        
        assert.fieldEquals("Block", blockId, "id", blockId)
        assert.fieldEquals("Block", blockId, "timestamp", timestamp)
        assert.fieldEquals("Block", blockId, "number", blockId)

        clearStore()
    })

    test("Handle transfer event - mint test", () => {
        let tokenId = BigInt.fromI32(44)
        let from = ZERO_ADDRESS
        let to = "0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f6"
        let mockEvent = newMockEvent()
        let newTransferEvent = new Transfer(
            mockEvent.address, 
            mockEvent.logIndex, 
            mockEvent.transactionLogIndex, 
            mockEvent.logType,
            mockEvent.block, 
            mockEvent.transaction, 
            mockEvent.parameters
        )
       
        newTransferEvent.parameters = new Array()

        let tokenParam = new ethereum.EventParam("tokenId", ethereum.Value.fromI32(tokenId.toI32()))
        let fromParam = new ethereum.EventParam("owner", 
        ethereum.Value.fromAddress(Address.fromString(from)))
        let toParam = new ethereum.EventParam("approved", 
        ethereum.Value.fromAddress(Address.fromString(to)))
        
        newTransferEvent.parameters.push(fromParam)
        newTransferEvent.parameters.push(toParam)
        newTransferEvent.parameters.push(tokenParam)

        handleTransfer(newTransferEvent)
        
        assert.fieldEquals("Account", to, "id", to)
        assert.fieldEquals("Token", tokenId.toHex(), "id", tokenId.toHex())
        assert.fieldEquals("Token", tokenId.toHex(), "burned", "false")
        assert.fieldEquals("Token", tokenId.toHex(), "owner", to)

        clearStore()
    })

    test("Handle transfer event - burn test", () => {
        let tokenId = BigInt.fromI32(64)
        let from = "0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f6"
        let to = ZERO_ADDRESS
        let mockEvent = newMockEvent()
        let newTransferEvent = new Transfer(
            mockEvent.address, 
            mockEvent.logIndex, 
            mockEvent.transactionLogIndex, 
            mockEvent.logType,
            mockEvent.block, 
            mockEvent.transaction, 
            mockEvent.parameters
        )
       
        newTransferEvent.parameters = new Array()

        let tokenParam = new ethereum.EventParam("tokenId", ethereum.Value.fromI32(tokenId.toI32()))
        let fromParam = new ethereum.EventParam("owner", 
        ethereum.Value.fromAddress(Address.fromString(from)))
        let toParam = new ethereum.EventParam("approved", 
        ethereum.Value.fromAddress(Address.fromString(to)))
        
        newTransferEvent.parameters.push(fromParam)
        newTransferEvent.parameters.push(toParam)
        newTransferEvent.parameters.push(tokenParam)

        handleTransfer(newTransferEvent)
        
        assert.fieldEquals("Token", tokenId.toHex(), "id", tokenId.toHex())
        assert.fieldEquals("Token", tokenId.toHex(), "burned", "true")
        assert.fieldEquals("Token", tokenId.toHex(), "owner", "")

        clearStore()
    }) 

    test("Handle transfer event - transfer test", () => {
        let tokenId = BigInt.fromI32(64)
        let from = "0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f6"
        let to = "0x9b9cc10852f215bcea3e684ef584eb2b7c24b8f7"
        let mockEvent = newMockEvent()
        let newTransferEvent = new Transfer(
            mockEvent.address, 
            mockEvent.logIndex, 
            mockEvent.transactionLogIndex, 
            mockEvent.logType,
            mockEvent.block, 
            mockEvent.transaction, 
            mockEvent.parameters
        )
       
        newTransferEvent.parameters = new Array()

        let tokenParam = new ethereum.EventParam("tokenId", ethereum.Value.fromI32(tokenId.toI32()))
        let fromParam = new ethereum.EventParam("owner", 
        ethereum.Value.fromAddress(Address.fromString(from)))
        let toParam = new ethereum.EventParam("approved", 
        ethereum.Value.fromAddress(Address.fromString(to)))
        
        newTransferEvent.parameters.push(fromParam)
        newTransferEvent.parameters.push(toParam)
        newTransferEvent.parameters.push(tokenParam)

        handleTransfer(newTransferEvent)
        
        assert.fieldEquals("Token", tokenId.toHex(), "id", tokenId.toHex())
        assert.fieldEquals("Token", tokenId.toHex(), "burned", "false")
        assert.fieldEquals("Token", tokenId.toHex(), "owner", to)

        clearStore()
    }) 
}