import { newMockEvent } from "matchstick-as/assembly/index"

export namespace helpers {

    export function getEventFromMock(event: any): any{
        let mockEvent = newMockEvent()
        let instanced_event = new event(
            mockEvent.address, 
            mockEvent.logIndex, 
            mockEvent.transactionLogIndex, 
            mockEvent.logType,
            mockEvent.block, 
            mockEvent.transaction, 
            mockEvent.parameters
        )
        return instanced_event
    }
}