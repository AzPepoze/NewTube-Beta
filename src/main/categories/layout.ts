import { Category } from "../../styleshift/types/store";

export const layout_category: Category = {
	category: "📐 Layout & UI",
	settings: [
		{
			type: "checkbox",
			id: "SwapRow",
			name: "Swap Sidebar Location",
			description: "Moves the sidebar (recommendations/chat) to the left side.",
			value: false,
			enable_css: `
                #columns {
                    display: flex !important;
                    flex-direction: row-reverse !important;
                }
                #secondary {
                    margin-right: 0 !important;
                    margin-left: 24px !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "SrollRow",
			name: "Independent Scrolling",
			description:
				"Allows the sidebar and comments to scroll independently from the video player. (Experimental)",
			value: false,
			enable_css: `
                html, body {
                    overflow: hidden !important;
                }
                ytd-app {
                    height: 100vh !important;
                    overflow: hidden !important;
                }
                #columns {
                    height: calc(100vh - 56px) !important;
                    overflow: hidden !important;
                }
                #primary {
                    height: 100% !important;
                    overflow-y: auto !important;
                    padding-right: 10px !important;
                    scrollbar-width: thin;
                }
                #secondary {
                    height: 100% !important;
                    overflow-y: auto !important;
                    scrollbar-width: thin;
                }
            `,
		},
		{
			type: "number_slide",
			id: "ScWidth",
			name: "Scrollbar Width",
			description: "Adjusts the width of the custom scrollbar.",
			value: 10,
			min: 0,
			max: 20,
			step: 1,
			var_css: "--scrollbar-width",
			constant_css: `
                ::-webkit-scrollbar {
                    width: var(--scrollbar-width, 10px) !important;
                    background: transparent !important;
                }
                ::-webkit-scrollbar-thumb {
                    background: var(--theme-color, #888) !important;
                    border-radius: 10px !important;
                }
            `,
		},
		{
			type: "checkbox",
			id: "HideShorts",
			name: "Hide Shorts",
			description: "Hides Shorts shelves from the home page and sidebar.",
			value: false,
			enable_css: `
                ytd-rich-shelf-renderer[is-shorts], 
                ytd-reel-shelf-renderer, 
                ytd-guide-entry-renderer:has(a[title="Shorts"]) { 
                    display: none !important; 
                }
            `,
		},
	],
};
