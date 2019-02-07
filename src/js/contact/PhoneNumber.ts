

/**
 * A PhoneNumber stores a formatted phone number in a way that is able to keep all numbers uniform.
 */
class PhoneNumber {
	/**
	 * The whole phone number as a string, with no formatting.
	 */
	public number: string;

	/**
	 * The country code. Defaults to 1.
	 */
	public countryCode: string;

	/**
	 * The area code of the phone number.
	 */
	public areaCode: string; // first 3/10 digits

	/**
	 * The middle three digits of a phone number.
	 */
	public prefix: string; // second 3/10 digits

	/**
	 * The last four digits of the phone number
	 */
	public lineNumber: string; // last 4 digits

	/**
	 * Creates a PhoneNumber.
	 * @param phoneNumber - Either a string or a number. They will be formatted such that they have at least 10 digits, with zeros filling from the left until there are 10 digits as long as the string isn't empty at initalization.
	 */
	constructor(phoneNumber: string | number) {


		if (typeof phoneNumber === "number") {
			phoneNumber = phoneNumber.toString(10);
		} else {
			phoneNumber = phoneNumber.replace(/\D/g, "");// Anything that's not a number is removed.
		}

		if (phoneNumber === "") {
			throw "PhoneNumberFormatError: Empty string provided";
		}

		if (phoneNumber.length < 10) {
			phoneNumber = String("0").repeat(10 - phoneNumber.length) + phoneNumber;//add padding for phone numbers that start with zero that may have been stripped
		}



		this.number = phoneNumber;
		this.countryCode = phoneNumber.length <= 10 ? "1" : phoneNumber.slice(0,phoneNumber.length - 10), 10;
		this.areaCode = phoneNumber.slice(-10, -7);
		this.prefix = phoneNumber.slice(-7, -4);
		this.lineNumber = phoneNumber.slice(-4);
	}

	/**
	 * Returns the phone number as a formatted string.
	 * @param intl - Whether to include the country code when the country code is +1 (USA). Area codes are always returned for non-us numbers.
	 */
	public getFormattedNumber(intl: boolean=false) {
		return ((intl || this.countryCode != "1") ? "+" + this.countryCode : "") + " (" + this.areaCode + ") " +
			this.prefix + "-" + this.lineNumber;
	}

	/**
	 * Returns the full phone number as a string.
	 * @param format - Whether to format the phone number.
	 * @param intl - Whether to force a country code. If true, the returned phone number will always have the country code. If false, the returned phone number will only have the code for non-us numbers.
	 */
	public toString(format:boolean=true, intl:boolean=false) {
		let formatted = "";

		// Country Code
		formatted += (intl || this.countryCode !== "1" ? (format ? "+" : "") + this.countryCode + (format ? " " : " ") : "");
		// Area Code
		formatted += (format ? "(" : "") + this.areaCode + (format ? ") " : "");
		// Prefix
		formatted += this.prefix + (format ? "-" : "");
		// Line Number
		formatted += this.lineNumber;

		return formatted;
	}



}

export default PhoneNumber;
export {PhoneNumber};