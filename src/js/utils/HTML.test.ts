import HTML from "./HTML";


describe("Escape HTML", () => {
    test("Ampersand", () => {
        expect(HTML.escape("txt&&txt"))
                .toBe("txt&amp;&amp;txt");
    });
    test("Less than and Greater than", () => {
        expect(HTML.escape("txt<><><<<><>>>text"))
                .toBe("txt&lt;&gt;&lt;&gt;&lt;&lt;&lt;&gt;&lt;&gt;&gt;&gt;text");
    });
    test("Quotation marks", () => {
        expect(HTML.escape("txt\"'''\"'text"))
                .toBe("txt&quot;&#039;&#039;&#039;&quot;&#039;text");
    });
    test("Should not escape other characters", () => {
        expect(HTML.escape("~!@#$%^*()_-=+:;?[]{},./"))
                .toBe("~!@#$%^*()_-=+:;?[]{},./");
    });
});