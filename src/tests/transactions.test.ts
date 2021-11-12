import { ethereum, Address, BigInt} from "@graphprotocol/graph-ts"
import { test, assert, clearStore, newMockEvent } from "matchstick-as/assembly/index"
import { Transfer } from "../../generated/BullrunBabesToken/BullrunBabesToken"
import { handleTransfer } from "../mappings/token"
import { ZERO_ADDRESS } from '@protofire/subgraph-toolkit'

export function runTransactionsTests() :void {
    test("Handle transfer event - transaction meta test", () => {
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

        let txHash = newTransferEvent.transaction.hash
        let txMetaId = txHash.toHexString()
        let blockId = newTransferEvent.block.number.toString()
        let txFrom = newTransferEvent.transaction.from
        let gasLimit = newTransferEvent.transaction.gasLimit
        let gasPrice = newTransferEvent.transaction.gasPrice
        
        assert.fieldEquals("TransactionMeta", txMetaId, "id", txMetaId)
        assert.fieldEquals("TransactionMeta", txMetaId, "block", blockId)
        assert.fieldEquals("TransactionMeta", txMetaId, "hash", txHash.toHexString())
        assert.fieldEquals("TransactionMeta", txMetaId, "from", txFrom.toHex())
        assert.fieldEquals("TransactionMeta", txMetaId, "gasLimit", gasLimit.toString())
        assert.fieldEquals("TransactionMeta", txMetaId, "gasPrice", gasPrice.toString())
               
        clearStore()
    }) 

    test("Handle transfer event - mint transaction test", () => {
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

        let timestamp = newTransferEvent.block.timestamp
        let mintId = from + "-" + to + "-" + timestamp.toString()
        let blockId = newTransferEvent.block.number.toString()
        
        assert.fieldEquals("Mint", mintId, "id", mintId)
        assert.fieldEquals("Mint", mintId, "from", from)
        assert.fieldEquals("Mint", mintId, "to", to)
        assert.fieldEquals("Mint", mintId, "token", tokenId.toHex())
        assert.fieldEquals("Mint", mintId, "block", blockId)
        assert.fieldEquals("Mint", mintId, "type", 'MINT')
        // how to test Mint is a transaction 
        // assert.fieldEquals("Transaction", mintId, "id", mintId)
               
        clearStore()
    }) 

    test("Handle transfer event - burn transaction test", () => {
        let tokenId = BigInt.fromI32(55)
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

        let timestamp = newTransferEvent.block.timestamp
        let burnId = from + "-" + to + "-" + timestamp.toString()
        let blockId = newTransferEvent.block.number.toString()
        
        assert.fieldEquals("Burn", burnId, "id", burnId)
        assert.fieldEquals("Burn", burnId, "from", from)
        assert.fieldEquals("Burn", burnId, "to", to)
        assert.fieldEquals("Burn", burnId, "token", tokenId.toHex())
        assert.fieldEquals("Burn", burnId, "block", blockId)
        assert.fieldEquals("Burn", burnId, "type", 'BURN')
        // how to test Burn is a transaction 
        // assert.fieldEquals("Transaction", burnId, "id", burnId)
               
        clearStore()
    }) 

    test("Handle transfer event - transfer transaction test", () => {
        let tokenId = BigInt.fromI32(55)
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

        let timestamp = newTransferEvent.block.timestamp
        let transferId = from + "-" + to + "-" + timestamp.toString()
        let blockId = newTransferEvent.block.number.toString()
        
        assert.fieldEquals("Transfer", transferId, "id", transferId)
        assert.fieldEquals("Transfer", transferId, "from", from)
        assert.fieldEquals("Transfer", transferId, "to", to)
        assert.fieldEquals("Transfer", transferId, "token", tokenId.toHex())
        assert.fieldEquals("Transfer", transferId, "block", blockId)
        assert.fieldEquals("Transfer", transferId, "type", 'TRANSFER')
        // how to test Burn is a transaction 
        // assert.fieldEquals("Transaction", burnId, "id", burnId)
               
        clearStore()
    }) 
}