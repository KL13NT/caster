const root = document.getElementById("keys");

const html = String.raw;

const onAnimationEnd = (e) => {
	e.target.parentNode.removeChild(e.target);
};

// TODO: add special key rendering and icons
// TODO: research addons

const SpecialKey = (content) => {
	return html`<span class="special">${content}</span>`;
};

const NormalKey = (content) => {
	return html`<span class="normal">${content}</span>`;
};

window.electronAPI.handleKey((_, { normal, modifiers }) => {
	document.removeEventListener("animationend", onAnimationEnd);

	const normalKeyMarkup = normal.map(NormalKey);
	const specialKeyMarkup = modifiers.map(SpecialKey);

	const node = document.createElement("p");
	node.classList.add("key");
	node.innerHTML = [...specialKeyMarkup, ...normalKeyMarkup].join(" + ");

	root.appendChild(node);

	document.addEventListener("animationend", onAnimationEnd);
});
