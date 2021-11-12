
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
	blocks,
	transactionsMeta,
	stats,
	roles
} from "../modules"
import { transfer } from "./transfer"

export function handleApproval(event: Approval): void {
  let tokenId = event.params.tokenId.toHex()
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

	let operatorOwner = accounts.getOrCreateOperatorOwner(owner.id, operator.id, event.params.approved)
	operatorOwner.save()
}

export function handlePaused(event: Paused): void {
	let account = event.params.account
	let timestamp = event.block.timestamp

	let pauser = accounts.getOrCreateAccount(account)
	pauser.save()

	let babesStats = stats.getOrCreateStats()
	babesStats.lastPauser = pauser.id
	babesStats.lastPauseDate = timestamp
	babesStats.isPaused = true
	babesStats.save()
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {
	let role = event.params.role.toHex()
	let prev = event.params.previousAdminRole
	let curr = event.params.newAdminRole
	let timestamp = event.block.timestamp

	let roleInstance = roles.getOrCreateRole(role)
	let prevAccount = accounts.getOrCreateAccount(prev)
	prevAccount.save()
	let currAccount = accounts.getOrCreateAccount(curr)
	currAccount.save()

	roleInstance.account = currAccount.id
	roleInstance.assignedBy = prevAccount.id
	roleInstance.assignedTimestamp = timestamp
	roleInstance.save()

}

export function handleRoleGranted(event: RoleGranted): void {
	let role = event.params.role.toHex()
	let accountId = event.params.account
	let senderId = event.params.sender
	let timestamp = event.block.timestamp
	
	let roleInstance = roles.getOrCreateRole(role)

	let account = accounts.getOrCreateAccount(accountId)
	account.save()
	let sender = accounts.getOrCreateAccount(senderId)
	sender.save()

	roleInstance.account = account.id
	roleInstance.assignedBy = sender.id
	roleInstance.assignedTimestamp = timestamp
	roleInstance.save()
}

export function handleRoleRevoked(event: RoleRevoked): void {
	let role = event.params.role.toHex()
	let accountId = event.params.account
	let senderId = event.params.sender
	let timestamp = event.block.timestamp

	let roleInstance = roles.getOrCreateRole(role)

	let account = accounts.getOrCreateAccount(accountId)
	account.save()
	let sender = accounts.getOrCreateAccount(senderId)
	sender.save()

	roleInstance.account = account.id
	roleInstance.revokedBy = sender.id
	roleInstance.revokedTimestamp = timestamp
	roleInstance.revoked = true
	roleInstance.save()
}

export function handleTransfer(event: Transfer): void {
	let from = event.params.from.toHex()
	let to = event.params.to.toHex()
	let tokenId = event.params.tokenId.toHex()
	let blockNumber = event.block.number
	let blockId = blockNumber.toString()
	let txHash = event.transaction.hash
	let timestamp = event.block.timestamp

	let block = blocks.getOrCreateBlock(blockId, timestamp, blockNumber)
	block.save()

	let meta = transactionsMeta.getOrCreateTransactionMeta(
		txHash.toHexString(),
		blockId,
		txHash,
		event.transaction.from,
		event.transaction.gasLimit,
		event.transaction.gasPrice
	)
	meta.save()

	// it handles mint
	if (from == ADDRESS_ZERO) {
		transfer.handleMint(event.params.to, tokenId, timestamp, blockId)
	// it handles burn 
	} else if (to == ADDRESS_ZERO) {
		transfer.handleBurn(event.params.from, tokenId, timestamp, blockId)
	// it handles a real transfer
	} else {
		transfer.handleRegularTransfer(event.params.from, event.params.to, tokenId, timestamp, blockId)
	}

}

export function handleUnpaused(event: Unpaused): void {
	let account = event.params.account
	let timestamp = event.block.timestamp

	let unPauser = accounts.getOrCreateAccount(account)
	unPauser.save()

	let babesStats = stats.getOrCreateStats()
	babesStats.lastUnpauser = unPauser.id
	babesStats.lastUnpauseDate = timestamp
	babesStats.isPaused = false
	babesStats.save()	
}
