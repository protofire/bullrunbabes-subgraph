import { BullrunBabesStats } from '../../../generated/schema'

export namespace stats {

	export function getOrCreateStats(): BullrunBabesStats {
		let statsId = "current"

		let stats = BullrunBabesStats.load(statsId)
		if (stats == null) {
			stats = new BullrunBabesStats(statsId)
		}
		stats.isPaused = false
		return stats as BullrunBabesStats
	}
	
}