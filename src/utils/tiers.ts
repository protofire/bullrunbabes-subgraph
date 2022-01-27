import { BigInt } from "@graphprotocol/graph-ts"

const NONE = "NONE"
const GOLD = "GOLD"
const DIAMONT = "DIAMONT"
const RAINBOW = "RAINBOW"

export namespace tiers {
    export function tierNameOf(id: BigInt): string {
        let tierId = id.toString()

        if (tierId == "0") return GOLD
        if (tierId == "1") return DIAMONT
        if (tierId == "2") return RAINBOW

        return NONE
    } 
}