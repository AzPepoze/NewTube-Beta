import { get_ytd_app } from "../modules/main";

let background_element: HTMLElement | null = null;

export const enable_background_css = `
ytd-app {
	background : transparent;
}

#newtube-bg {
	width : 100%;
	height : 100%;
	
	position : fixed;
	left : 0;
	top : 0;
	z-index : -1;

	background: var(--page-bg-tint-color);
}
`;

export async function enable_background() {
	if (!background_element) {
		background_element = document.createElement("div");
		background_element.id = "newtube-bg";
	}

	(await get_ytd_app()).appendChild(background_element);
	console.log(background_element);
}

export async function disable_background() {
	if (background_element) {
		background_element.remove();
		background_element = null;
	}
}
