import { Load } from "../../styleshift/core/save";
import { Category } from "../../styleshift/types/store";
import { setupTabIconChanger, disableTabIconChanger } from "../features/tab-icon";

export const TabIconCategory: Category = {
	Category: "🔶 Tab Icon",
	Settings: [
		{
			type: "Checkbox",
			id: "CustomIcon",
			name: "Enable Custom Tab Icon",
			description: "Replaces the YouTube browser tab icon (favicon) with a custom image.",
			value: true,
			setup_function: setupTabIconChanger,
			disable_function: disableTabIconChanger,
		},
		{
			type: "Text_Input",
			id: "IconURL",
			name: "Tab Icon URL",
			description: "URL for the custom tab icon image.",
			value: "https://i.ibb.co/tD2VTyg/1705431438657.png",
			update_function: async function (value) {
				const useCustomIcon = await Load("CustomIcon");
				if (useCustomIcon) {
					let favicon = document.querySelector('link[rel*="icon"]') as HTMLLinkElement;
					if (favicon) {
						favicon.href = value;
					}
				}
			},
		},
	],
};
