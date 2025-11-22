import { Category } from "../../styleshift/types/store";
import { enable_background, enable_background_css } from "../features/background";

export const BackgroundCategory: Category = {
	Category: "🎴 Background",
	Settings: [
		{
			type: "Checkbox",
			id: "bg_enable",
			name: "Enable Background",
			value: true,
			enable_function: enable_background,
			enable_css: enable_background_css,
		},
		{
			type: "Color",
			id: "BG",
			name: "Background / Tint Color",
			description:
				"Sets the color and opacity of the page background or the tint applied over an image/video.",
			value: "#F66151FF",
			var_css: "--page-bg-tint-color",
		},
		{
			type: "Text_Input",
			id: "BGIMG",
			name: "Background Image URL",
			description: "URL of the image to use as the page background.",
			value: "",
			update_function: function (value) {
				document.documentElement.style.setProperty("--page-bg-image-url", `url(${value})`);
			},
		},
		{
			type: "Number_Slide",
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
			type: "Number_Slide",
			id: "BackgroundS",
			name: "Background Size",
			description: "Adjusts the size of the background image.",
			value: 100,
			min: 50,
			max: 300,
			step: 5,
			var_css: "--page-bg-size",
		},
		{
			type: "Checkbox",
			id: "Repeat",
			name: "Repeat Background Image",
			description: "Repeats the background image instead of stretching it.",
			value: false,
			enable_css: `:root { --page-bg-repeat: repeat; }`,
			disable_css: `:root { --page-bg-repeat: no-repeat; }`,
		},
		{
			type: "Checkbox",
			id: "EnaVDOBG",
			name: "Enable Video Background (UI Only)",
			description: "UI Placeholder. Replaces the background with a video. (Functionality not implemented)",
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
