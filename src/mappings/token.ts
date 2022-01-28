
import { ADDRESS_ZERO } from '@protofire/subgraph-toolkit'
import {
  Approval,
  ApprovalForAll,
  Paused,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer,
  Unpaused
} from "../../generated/BullrunBabesToken/BullrunBabesToken"
import {
	tokens,
	accounts,
} from "../modules"
import { transfer } from "./transfer"

export function handleApproval(event: Approval): void {
    let tokenId = event.params.tokenId.toString()
	let ownerAddress = event.params.owner
	let approvedAddress = event.params.approved

	let approved = accounts.getOrCreateAccount(approvedAddress)
	approved.save()

	let owner = accounts.getOrCreateAccount(ownerAddress)
	owner.save()

	let token = tokens.addApproval(tokenId, approvedAddress.toHex())
	token.save()
}

export function handleApprovalForAll(event: ApprovalForAll): void {
	let ownerAddress = event.params.owner
	let operatorAddress = event.params.operator

	let owner = accounts.getOrCreateAccount(ownerAddress)
	owner.save()

	let operator = accounts.getOrCreateAccount(operatorAddress)
	operator.save()
}

export function handlePaused(event: Paused): void {
	let account = event.params.account
	let pauser = accounts.getOrCreateAccount(account)
	pauser.save()
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {
	let prev = event.params.previousAdminRole
	let curr = event.params.newAdminRole

	let prevAccount = accounts.getOrCreateAccount(prev)
	prevAccount.save()
	let currAccount = accounts.getOrCreateAccount(curr)
	currAccount.save()

}

export function handleRoleGranted(event: RoleGranted): void {
	let accountId = event.params.account
	let senderId = event.params.sender

	let account = accounts.getOrCreateAccount(accountId)
	account.save()
	let sender = accounts.getOrCreateAccount(senderId)
	sender.save()
}

export function handleRoleRevoked(event: RoleRevoked): void {
	let accountId = event.params.account
	let senderId = event.params.sender
	let account = accounts.getOrCreateAccount(accountId)
	account.save()
	let sender = accounts.getOrCreateAccount(senderId)
	sender.save()
}

export function handleTransfer(event: Transfer): void {
	let from = event.params.from.toHex()
	let to = event.params.to.toHex()
	let tokenId = event.params.tokenId.toString()
	let timestamp = event.block.timestamp

	// it handles mint
	if (from == ADDRESS_ZERO) {
        transfer.handleMint(event.params.to, tokenId, timestamp)
	// it handles burn 
	} else if (to == ADDRESS_ZERO) {
		transfer.handleBurn(event.params.from, tokenId, timestamp)
	// it handles a real transfer
	} else {
		transfer.handleRegularTransfer(event.params.from, event.params.to, tokenId, timestamp)
	}

}

export function handleUnpaused(event: Unpaused): void {
	let account = event.params.account
	let unPauser = accounts.getOrCreateAccount(account)
	unPauser.save()
}
