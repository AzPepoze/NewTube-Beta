import { Category } from "../../styleshift/types/store";

export const BordersShadowsCategory: Category = {
	category: "🔳 Borders / Shadows",
	settings: [
		{
			type: "Dropdown",
			id: "OutOrSha",
			name: "Style Type",
			description: "Choose between outlines (borders), shadows, or none for applicable elements.",
			value: "Shadows",
			options: {
				Borders: {
					enable_css: `
                        :root {
                            --global-style-outline: var(--global-border-width, 1px) solid var(--global-border-color, #099DFF80);
                            --global-style-shadow: none;
                        }
                    `,
				},
				Shadows: {
					enable_css: `
                        :root {
                            --global-style-outline: none;
                            --global-style-shadow: 0 0 var(--global-border-width, 8px) var(--global-border-color, #099DFF80);
                        }
                    `,
				},
				None: {
					enable_css: `
                        :root {
                            --global-style-outline: none;
                            --global-style-shadow: none;
                        }
                    `,
				},
			},
		},
		{
			type: "Number_Slide",
			id: "Border",
			name: "Width / Size",
			description: "Adjusts the width of the border or the size of the shadow.",
			value: 8,
			min: 1,
			max: 50,
			step: 1,
			var_css: "--global-border-width",
		},
		{
			type: "Color",
			id: "OutSha",
			name: "Color",
			description: "The color of the border or shadow.",
			value: "#099DFF80",
			var_css: "--global-border-color",
		},
	],
};
