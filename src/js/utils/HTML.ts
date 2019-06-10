/**
 * Utilities for HTML.
 */

class HTML {
    /**
     * Escapes given text such that when rendered as HTML it shows as text.
     * @param text - the text to escape.
     */
    public static escape(text) {
        return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
    }
}

export default HTML;
export { HTML };
