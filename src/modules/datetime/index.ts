import { BigInt } from "@graphprotocol/graph-ts";
import { Date } from "../../../generated/schema";

export class FullDate {
    day: BigInt;
    month: BigInt;
    year: BigInt;

    constructor(day: BigInt, month: BigInt, year: BigInt) {
        this.day = day;
        this.month = month;
        this.year = year;
    }
}

export namespace datetime {
    export namespace helpers {

		export function getNewId(
			day: string,
			month: string,
            year: string,
		): string {
			return `${month}${day}${year}`
		}

        export function toBigInt(integer: i32): BigInt {
            return BigInt.fromI32(integer)
        }
        
        export let SECONDS_IN_DAY = BigInt.fromI32(86400);
        export let ZERO = BigInt.fromI32(0);   
        export let ONE = BigInt.fromI32(1);
	}
    

    export function getOrCreateDate(timestamp: BigInt): Date {
        let dayMonthYear = dayMonthYearFromEventTimestamp(timestamp);
        let month = dayMonthYear.month.toString();
        let day = dayMonthYear.day.toString();
        month = month.length === 1 ? "0".concat(month) : month;
        day = day.length === 1 ? "0".concat(day) : day;

        let dateId = helpers.getNewId(day, month, dayMonthYear.year.toString())

        let dateEntity = Date.load(dateId)
		if (dateEntity == null) {
			dateEntity = new Date(dateId)
		}
        dateEntity.day = day
        dateEntity.month = month
        dateEntity.year = dayMonthYear.year.toString()

		return dateEntity as Date
    }

    // Ported from http://howardhinnant.github.io/date_algorithms.html#civil_from_days
    function dayMonthYearFromEventTimestamp(unixEpoch: BigInt): FullDate {

        // you can have leap seconds apparently - but this is good enough for us ;)
        let daysSinceEpochStart = unixEpoch / helpers.SECONDS_IN_DAY;
        daysSinceEpochStart = daysSinceEpochStart + helpers.toBigInt(719468);

        let era = (daysSinceEpochStart >= helpers.ZERO ? daysSinceEpochStart : daysSinceEpochStart - helpers.toBigInt(146096)) / helpers.toBigInt(146097);
        let dayOfEra = (daysSinceEpochStart - era * helpers.toBigInt(146097));          // [0, 146096]
        let yearOfEra = (dayOfEra - dayOfEra/helpers.toBigInt(1460) + dayOfEra/helpers.toBigInt(36524) - dayOfEra/helpers.toBigInt(146096)) / helpers.toBigInt(365);  // [0, 399]

        let year = yearOfEra + (era * helpers.toBigInt(400));
        let dayOfYear = dayOfEra - (helpers.toBigInt(365)*yearOfEra + yearOfEra/helpers.toBigInt(4) - yearOfEra/helpers.toBigInt(100));                // [0, 365]
        let monthZeroIndexed = (helpers.toBigInt(5) * dayOfYear + helpers.toBigInt(2)) / helpers.toBigInt(153);                                   // [0, 11]
        let day = dayOfYear - (helpers.toBigInt(153) * monthZeroIndexed + helpers.toBigInt(2)) / helpers.toBigInt(5) + helpers.toBigInt(1);                             // [1, 31]
        let month = monthZeroIndexed + (monthZeroIndexed < helpers.toBigInt(10) ? helpers.toBigInt(3) : helpers.toBigInt(-9));                            // [1, 12]

        year = month <= helpers.toBigInt(2) ? year + helpers.ONE : year;

        return new FullDate(day, month, year);
    }
}