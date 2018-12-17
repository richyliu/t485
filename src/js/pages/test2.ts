import { sayGoodbye } from "../greet";

function showGoodbye(divName: string, name: string) {
	const elt = document.getElementById(divName);
	elt.innerText = sayGoodbye(name);
}

showGoodbye("greeting", "TypeScript");