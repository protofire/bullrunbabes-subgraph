import { Bytes } from '@graphprotocol/graph-ts';
import { Account } from '../../../generated/schema'

export namespace accounts {

	export namespace helpers {

		export function getOperatorOwnerId(
			ownerId: string,
			operatorId: string
		): string {
			return ownerId.concat("-".concat(operatorId))
		}

	}

	export function getOrCreateAccount(accountAddress: Bytes): Account {
		let accountId = accountAddress.toHex()

		let account = Account.load(accountId)
		if (account == null) {
			account = new Account(accountId)
		}
		return account as Account
	}
}