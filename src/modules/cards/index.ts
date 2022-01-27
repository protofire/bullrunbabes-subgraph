import { Card } from "../../../generated/schema"

export namespace cards {
    export function getOrCreateToken(tokenId: string): Card {
		let card = Card.load(tokenId)
		if (card == null) {
			card = new Card(tokenId)
		}

		return card as Card
	}
}