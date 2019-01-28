/**
 * Stores a phone number in a formatted way.
 */
class PhoneNumber {
	public number: string;
	public countryCode: string;
	public areaCode: string; // first 3/10 digits
	public prefix: string; // second 3/10 digits
	public lineNumber: string; // last 4 digits

	/**
	 * Creates a PhoneNumber.
	 * @param number - Either a string or a number. They will be formatted such that they have at least 10 digits
	 */
	constructor(number: string | number) {
		if (typeof number === "number") {
			number = number.toString(10);
			if (number.length < 10) {
				number = String("0").repeat(10 - number.length) + number;//add padding for phone numbers that start with zero that may have been stripped
			}
		} else {
			number = number.replace(/\D/g, "");// Anything that's not a number is removed.
		}
		this.number = number;
		this.countryCode = number.length < 10 ? "1" : number.substring(0,number.length - 10), 10;
		this.areaCode = number.substring(-10, -7);
		this.prefix = number.substring(-7, -4);
		this.lineNumber = number.substring(-4);
	}

	/**
	 * Returns the phone number as a formatted string.
	 * @param intl - Whether to include the country code when the country code is +1 (USA). Area codes are always returned for non-us numbers.
	 */
	public getFormattedNumber(intl: boolean=false) {
		return ((intl || this.countryCode != "1") ? "+" + this.countryCode : "") + " (" + this.areaCode + ") " +
			this.prefix + "-" + this.lineNumber;
	}



}

export default PhoneNumber;
export {PhoneNumber};