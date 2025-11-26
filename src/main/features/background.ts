import { GetDocumentBody } from "../../styleshift/build-in-functions/normal";
import { Load_Setting } from "../../styleshift/core/save";
import { On_Setting_Update } from "../../styleshift/settings/functions";

const bg_tint_id = "newtube-bg-tint";
const bg_image_id = "newtube-bg-image";

let bg_tint_element: HTMLElement | null = null;
let bg_image_element: HTMLElement | null = null;
const bg_image = new Image();

export const enable_background_css = `
ytd-app {
	background : transparent;
}

#${bg_tint_id},
#${bg_image_id} {
	width : 100%;
	height : 100%;
	
	position : fixed;
	left : 0;
	top : 0;
	z-index : -1;

	background: var(--page-bg-tint-color);
}

#${bg_image_id} {
	z-index: -10000;
    transition: opacity 1s;
}
`;

function get_element() {
	bg_tint_element = document.getElementById(bg_tint_id);
	bg_image_element = document.getElementById(bg_image_id);
}

export async function enable_bg() {
	get_element();

	if (!bg_tint_element) {
		bg_tint_element = document.createElement("div");
		bg_tint_element.id = bg_tint_id;
	}

	if (!bg_image_element) {
		bg_image_element = document.createElement("div");
		bg_image_element.id = bg_image_id;
	}

	(await GetDocumentBody()).appendChild(bg_tint_element);
	(await GetDocumentBody()).appendChild(bg_image_element);
}

export async function disable_bg() {
	get_element();

	if (bg_tint_element) {
		bg_tint_element.remove();
		bg_tint_element = null;
	}
	if (bg_image_element) {
		bg_image_element.remove();
		bg_image_element = null;
	}
}

export async function update_bg_img() {
	console.log("BG updated");
	const url = await Load_Setting("BGIMG");
	bg_image.src = url;
}

export async function update_bg_img_size() {
	const bg_bound = bg_image_element.getBoundingClientRect();
	const Imagine_Background_Height = (bg_image.height / bg_image.width) * window.innerWidth;
	const zoomValue = await Load_Setting("BackgroundS");

	if (Imagine_Background_Height < bg_bound.height) {
		bg_image_element.style.backgroundSize = `${(bg_bound.height / Imagine_Background_Height) * zoomValue}%`;
	} else {
		bg_image_element.style.backgroundSize = `${zoomValue}%`;
	}
}

bg_image.onload = function () {
	if (bg_image_element) bg_image_element.style.backgroundImage = `url("${bg_image.src}")`;
	update_bg_img_size();
};

On_Setting_Update("BGIMG", update_bg_img, true);
