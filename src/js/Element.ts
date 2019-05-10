/**
 * An Element is some HTML that is ready to be pushed to the DOM.
 */
export default class Element {

    /**
     * The HTML for the Element.
     */
    protected html: string;

    /**
     * Create an element with the given HTML.
     * @param html - The HTML for the element.
     */
    constructor(html?: string) {
        this.html = html || "";
    }

    /**
     * Get the HTML of the element.
     */
    getHTML() {
        return this.html;
    }
}