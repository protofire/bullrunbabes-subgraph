import { BigInt, log } from '@graphprotocol/graph-ts'
import { Token } from "../../../generated/schema";


export namespace tokens {
	export function getOrCreateToken(tokenId: string, accountId: string): Token {
		let token = Token.load(tokenId)
		if (token == null) {
			token = new Token(tokenId)
			token.owner = accountId
		}
		return token as Token
	}

	export function loadToken(tokenId: string): Token {
		let token = Token.load(tokenId)
		if (token == null) {
			log.info(
				"@@@@@ at func: {} msg: {}",
				["loadToken",
					"Couldn't find token w/ id: " + tokenId]
			)
			log.warning("Token will be created", [])
			token = new Token(tokenId)
		}
		return token as Token
	}

	export function addUri(
		tokenId: string, owner: string, uri: string
	): Token {
		let token = getOrCreateToken(tokenId, owner)
		token.uri = uri
		return token as Token
	}

	export function mintToken(
		tokenId: string, owner: string
	): Token {
		let token = getOrCreateToken(tokenId, owner)
		token.burned = false
		return token as Token
	}

	export function burnToken(
		tokenId: string
	): Token {
		let token = loadToken(tokenId)
		token.burned = true
		return token as Token
	}


	export function changeOwner(tokenId: string, owner: string): Token {
		let token = loadToken(tokenId)
		token.owner = owner
		return token as Token
	}

	export function addApproval(tokenId: string, approval: string): Token {
		let token = loadToken(tokenId)
		token.approval = approval
		return token as Token
	}
}
