import Query from "./Query";



// TODO: Test with URL

describe("Query.get without URL", () => {
	test("Decode Query", () => {
		expect(Query.get("a")).toBe("Query A");
	});
});

describe("Query.get with URL", () => {

	test("Decode Query", () => {
		expect(Query.get("q","?q=Hello%20World&foo=hi")).toBe("Hello World");
	});

	test("Decode Query in full URL", () => {
		expect(Query.get("q","https://example.com/page.html?q=Hello%20World&foo=hi")).toBe("Hello World");
	});

	test("Decode More Complicated Queries", () => {
		expect(Query.get("query",
			"?query=" + encodeURIComponent("ABCDEFGHIJKLMNOPWQRSTUVWXYZ~`!@#$%^&*()1234567890_+-={}|:\"<>?[]\\;',./") + "&foo=hi"))
			.toBe("ABCDEFGHIJKLMNOPWQRSTUVWXYZ~`!@#$%^&*()1234567890_+-={}|:\"<>?[]\\;',./")
	});

	test("Boolean Query", () => {
		expect(Query.get("q","?q=&foo=hi")).toBe("");
	});

	test("Empty Query", () => {
		expect(Query.get("q","?q=&foo=hi")).toBe("");
	});

	test("Nonexistent Query", () => {
		expect(Query.get("q","?foo=hi")).toBe(null);
	});

	test("Preserve numbers as string", () => {
		expect(Query.get("q","?q=0")).toBe("0");
	});

	test("Preserve booleans as string", () => {
		expect(Query.get("q","?q=false")).toBe("false");
	});

	test("Don't get parameters in hash tag.", () => {
		expect(Query.get("q","?#q=helloworld")).toBe(null);
	});
});