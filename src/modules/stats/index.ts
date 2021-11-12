import { BullrunBabesStat } from '../../../generated/schema'

export namespace stats {

	export function getOrCreateStats(): BullrunBabesStat {
		let statsId = "current"

		let stats = BullrunBabesStat.load(statsId)
		if (stats == null) {
			stats = new BullrunBabesStat(statsId)
		}
		stats.isPaused = false
		return stats as BullrunBabesStat
	}
	
}