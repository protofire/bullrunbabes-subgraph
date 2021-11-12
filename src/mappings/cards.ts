import {
  CardAllocated,
  RandomInitiated,
  RandomReceived,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked
} from "../../generated/BullrunBabesCoordinator/BullrunBabesCoordinator"
import { Card } from "../../generated/schema"

//export { runTests } from "../tests/export.test"

export function handleCardAllocated(event: CardAllocated): void {
  let tokenId = event.params.tokenId
  let cardId = tokenId.toString()
  let owner = event.params.owner
  let serial = event.params.serial
  let cardTypeId = event.params.cardTypeId
  let cid = event.params.cid
  let queryId = event.params.queryId
  let tier = event.params.tier
  
  let card = Card.load(cardId)

  if (!card) {
    card = new Card(cardId)
  }
  
  card.tokenId = tokenId
  card.owner = owner
  card.serial = serial
  card.cardTypeId = cardTypeId
  card.tier = tier
  card.cid = cid
  card.queryId = queryId
  
  
  card.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.DEFAULT_ADMIN_ROLE(...)
  // - contract.ORACLE_ROLE(...)
  // - contract.OWNER_ROLE(...)
  // - contract.PAUSER_ROLE(...)
  // - contract.cardTypeOf(...)
  // - contract.checkInflight(...)
  // - contract.cidOf(...)
  // - contract.cidOfType(...)
  // - contract.getAllocations(...)
  // - contract.getCard(...)
  // - contract.getOracleGasFee(...)
  // - contract.getPrice(...)
  // - contract.getRoleAdmin(...)
  // - contract.getRoleMember(...)
  // - contract.getRoleMemberCount(...)
  // - contract.hasRole(...)
  // - contract.inflightReserves(...)
  // - contract.priceOf(...)
  // - contract.saleTokenByIndex(...)
  // - contract.serialOf(...)
  // - contract.tierOf(...)
  // - contract.tierOfType(...)
  // - contract.totalSaleSupply(...)
}

export function handleRandomInitiated(event: RandomInitiated): void {}

export function handleRandomReceived(event: RandomReceived): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

