import { ADDRESS_ZERO } from '@protofire/subgraph-toolkit'
import { BigInt } from "@graphprotocol/graph-ts";
import {
    Buy,
    Draw, Trade,
} from "../../../generated/schema";
import { datetime } from '../datetime';

export namespace transactions {

	export namespace constants {
		export let TRANSACTION_DRAW = "DRAW"
		export let TRANSACTION_TRADE = "TRADE"
		export let TRANSACTION_BUY = "BUY"
	}

	export namespace helpers {
		export function getNewTransactionId(
			from: string, to: string, timestamp: BigInt
		): string {
			return from + "-" + to + "-" + timestamp.toString()
		}
	}

	export function getNewMint(
		to: string, token: string, timestamp: BigInt
	): Draw {
		let transaction = new Draw(helpers.getNewTransactionId(ADDRESS_ZERO, to, timestamp))
		transaction.from = ADDRESS_ZERO
		transaction.to = to
		transaction.card = token
        transaction.timestamp = timestamp
		transaction.type = constants.TRANSACTION_DRAW
        let date = datetime.getOrCreateDate(timestamp)
        date.save()

        transaction.date = date.id
        
		return transaction as Draw
	}

	export function getNewBurn(from: string, token: string, timestamp: BigInt): Trade {
		let transaction = new Trade(helpers.getNewTransactionId(from, ADDRESS_ZERO, timestamp))
		transaction.from = from
		transaction.to = ADDRESS_ZERO
		transaction.card = token
        transaction.timestamp = timestamp
		transaction.type = constants.TRANSACTION_TRADE
        let date = datetime.getOrCreateDate(timestamp)
        date.save()

        transaction.date = date.id
        
		return transaction as Trade
	}

	export function getNewTransfer(
		from: string, to: string,
		token: string, timestamp: BigInt
	): Buy {
		let transaction = new Buy(helpers.getNewTransactionId(from, to, timestamp))
		transaction.from = from
		transaction.to = to
		transaction.card = token
        transaction.timestamp = timestamp
		transaction.type = constants.TRANSACTION_BUY
        let date = datetime.getOrCreateDate(timestamp)
        date.save()

        transaction.date = date.id
        
		return transaction as Buy
	}

}