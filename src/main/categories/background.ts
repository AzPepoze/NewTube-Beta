import { Category } from "../../styleshift/types/store";
import { enable_bg, enable_background_css, update_bg_img } from "../features/background";

export const background_category: Category = {
	category: "🎴 Background",
	settings: [
		{
			type: "checkbox",
			id: "bg_enable",
			name: "Enable Background",
			value: true,
			enable_function: enable_bg,
			enable_css: enable_background_css,
		},
		{
			type: "color",
			id: "BG",
			name: "Background / Tint color",
			description:
				"Sets the color and opacity of the page background or the tint applied over an image/video.",
			value: "#f661515e",
			var_css: "--page-bg-tint-color",
		},
		{
			type: "text_input",
			id: "BGIMG",
			name: "Background image URL",
			description: "URL of the image to use as the page background.",
			value: "https://cdn.wallpapersafari.com/74/55/4dgN3G.jpg",
		},
		{
			type: "number_slide",
			id: "BlurBGAM",
			name: "Background Blur Amount",
			description: "Applies a blur effect to the background image/video.",
			value: 10,
			min: 0,
			max: 50,
			step: 1,
			var_css: "--page-bg-blur",
		},
		{
			type: "number_slide",
			id: "BackgroundS",
			name: "Background size",
			description: "Adjusts the size of the background image.",
			value: 100,
			min: 50,
			max: 300,
			step: 5,
			var_css: "--page-bg-size",
			update_function: update_bg_img,
		},
		{
			type: "checkbox",
			id: "Repeat",
			name: "Repeat Background image",
			description: "Repeats the background image instead of stretching it.",
			value: false,
			enable_css: `:root { --page-bg-repeat: repeat; }`,
			disable_css: `:root { --page-bg-repeat: no-repeat; }`,
		},
		{
			type: "checkbox",
			id: "EnaVDOBG",
			name: "Enable Video Background (ui Only)",
			description: "ui placeholder. replaces the background with a video. (Functionality not implemented)",
			value: false,
			constant_css: `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    z-index: -3;
                    background-image: var(--page-bg-image-url);
                    background-size: var(--page-bg-size, cover);
                    background-position: center;
                    background-repeat: var(--page-bg-repeat, no-repeat);
                    filter: blur(var(--page-bg-blur, 0px));
                }`,
		},
	],
};
