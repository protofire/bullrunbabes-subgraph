import { runCardsTests } from "./cards.test";
import { runTokenTests } from "./token.test"; 
import { runPauseTests } from "./pause.test";

export function runTests() :void {
    runCardsTests()
    runTokenTests()
    runPauseTests()
}