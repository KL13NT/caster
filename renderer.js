const root = document.getElementById("keys");

const html = String.raw;

const onAnimationEnd = (e) => {
	e.target.parentNode.removeChild(e.target);
};

const SpecialKey = (content) => {
	return html`<span class="special">${content}</span>`;
};

const NormalKey = (content) => {
	return html`<span class="normal">${content}</span>`;
};

let previousLog = "";
let previousLogTime = 0;

document.removeEventListener("animationend", onAnimationEnd);

window.electronAPI.handleKey((_, { normal, modifiers }) => {
	const normalKeyMarkup = normal.map(NormalKey);
	const specialKeyMarkup = modifiers.map(SpecialKey);
	const log = [...specialKeyMarkup, ...normalKeyMarkup].join(" + ");

	if (log === previousLog && previousLogTime + 500 > Date.now()) {
		return;
	}

	const node = document.createElement("p");
	node.classList.add("key");
	node.innerHTML = log;

	previousLog = log;
	previousLogTime = Date.now();

	root.appendChild(node);

	document.addEventListener("animationend", onAnimationEnd);
});
