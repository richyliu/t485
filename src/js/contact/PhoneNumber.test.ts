import PhoneNumber from "./PhoneNumber";


describe("Phone Number from 11 digit number", () => {
	let number = new PhoneNumber(34953874689);
	test("Full Number", () => {
		expect(number.number)
			.toBe("34953874689");
	});
	test("Country Code", () => {
		expect(number.countryCode)
			.toBe("3");
	});
	test("Area Code", () => {
		expect(number.areaCode)
			.toBe("495");
	});
	test("Prefix", () => {
		expect(number.prefix)
			.toBe("387");
	});
	test("Line Number", () => {
		expect(number.lineNumber)
			.toBe("4689");
	});
});
describe("Phone Number from zero-filled 6-digit number", () => {
	let number = new PhoneNumber(874689);
	test("Full Number", () => {
		expect(number.number)
			.toBe("0000874689");
	});
	test("Country Code", () => {
		expect(number.countryCode)
			.toBe("1");
	});
	test("Area Code", () => {
		expect(number.areaCode)
			.toBe("000");
	});
	test("Prefix", () => {
		expect(number.prefix)
			.toBe("087");
	});
	test("Line Number", () => {
		expect(number.lineNumber)
			.toBe("4689");
	});
});

describe("Phone Number from String with formatting", () => {
	let number = new PhoneNumber("+3 (495) 387-4689");
	test("Full Number", () => {
		expect(number.number)
			.toBe("34953874689");
	});
	test("Country Code", () => {
		expect(number.countryCode)
			.toBe("3");
	});
	test("Area Code", () => {
		expect(number.areaCode)
			.toBe("495");
	});
	test("Prefix", () => {
		expect(number.prefix)
			.toBe("387");
	});
	test("Line Number", () => {
		expect(number.lineNumber)
			.toBe("4689");
	});
});
