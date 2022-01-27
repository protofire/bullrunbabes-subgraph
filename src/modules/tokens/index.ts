import { log } from '@graphprotocol/graph-ts'
import { Card } from "../../../generated/schema";

const BASE_METADATA_URI = 'https://www.bullrunbabes.com/api/metadata'

export namespace tokens {
	export function getOrCreateCard(tokenId: string, accountId: string): Card {
		let token = Card.load(tokenId)
		if (token == null) {
			token = new Card(tokenId)
			token.owner = accountId
		}
		return token as Card
	}

	export function loadToken(tokenId: string): Card {
		let token = Card.load(tokenId)
		if (token == null) {
			log.info(
				"@@@@@ at func: {} msg: {}",
				["loadToken",
					"Couldn't find token w/ id: " + tokenId]
			)
			log.warning("Card will be created", [])
			token = new Card(tokenId)
		}
		return token as Card
	}

	export function mintToken(
		tokenId: string, owner: string
	): Card {
		let token = getOrCreateCard(tokenId, owner)
        token.uri = `${BASE_METADATA_URI}/${tokenId}`
        token.burned = false
        return token as Card
	}

	export function burnToken(
		tokenId: string
	): Card {
		let token = loadToken(tokenId)
		token.burned = true
		return token as Card
	}


	export function changeOwner(tokenId: string, owner: string): Card {
		let token = loadToken(tokenId)
		token.owner = owner
		return token as Card
	}

	export function addApproval(tokenId: string, approval: string): Card {
		let token = loadToken(tokenId)
		token.approval = approval
		return token as Card
	}
}
