import { Open_Setting_Page } from "../styleshift/build-in-functions/extension";
import { Category } from "../styleshift/types/store";

const Default_StyleShift_Items: Category[] = [
	{
		category: "☕ Buy me a coffee!",
		rainbow: true,
		settings: [
			{
				click_function: 'window.open("https://ko-fi.com/azpepoze");',
				color: "#ff040bff",
				font_size: 15,
				icon: "https://cdn.prod.website-files.com/5c14e387dab576fe667689cf/670f5a01229bf8a18f97a3c1_favion-p-500.png",
				name: "Ko-fi",
				text_align: "left",
				type: "Button",
			},
		],
		selector: "",
	},
	{
		category: "🎉 Join my Discord!",
		rainbow: true,
		settings: [
			{
				click_function: 'window.open("https://discord.gg/BgxvVqap4G");',
				color: "#1932ffff",
				font_size: 15,
				icon: "https://brandlogos.net/wp-content/uploads/2021/11/discord-logo.png",
				name: "NEWTUBE",
				text_align: "left",
				type: "Button",
			},
		],
	},
	{
		category: "⚙️ Extention's settings",
		settings: [
			{
				id: "Enable_Extension",
				name: "Enable",
				type: "Checkbox",
				value: true,
				disable_function: "Disable_Extension_Function()",
				enable_function: "Enable_Extension_Function()",
				// enable_css: main_css,
			},
			{
				id: "Realtime_Extension",
				name: "Realtime Changing",
				type: "Checkbox",
				value: false,
			},
			{
				type: "Checkbox",
				id: "Setting_BG_Transparent",
				name: "Enable Blur Background",
				description: "Makes the settings menu background transparent and blurred.",
				value: true,
				enable_css: `
			      .STYLESHIFT-Window {
			        background-color: rgba(30, 30, 30, 0.5) !important;
			        backdrop-filter: blur(var(--setting-bg-blur-amount, 10px)) !important;
			        transition: background-color 0.3s, backdrop-filter 0.3s;
			      }
			    `,
				disable_css: `
			      .STYLESHIFT-Window {
			        background-color: rgb(30, 30, 30) !important;
			        backdrop-filter: none !important;
			      }
			    `,
			},
			{
				type: "Number_Slide",
				id: "Setting_BG_Blur_Amount",
				name: "Background Blur Amount",
				description: "Adjusts the blur amount for the settings menu background.",
				value: 10,
				min: 0,
				max: 50,
				step: 1,
				var_css: "--setting-bg-blur-amount",
			},
			{
				click_function: Open_Setting_Page,
				color: "#646464ff",
				description: "Description of this Button",
				font_size: 15,
				icon: "",
				id: "Test_Button",
				name: "Open settings page!",
				text_align: "center",
				type: "Button",
			},
			{
				click_function: 'window.open("https://github.com/AzPepoze/Newtube");',
				color: "#2e16feff",
				description: "Description of this Button",
				font_size: 15,
				icon: "https://pbs.twimg.com/profile_images/1372304699601285121/5yBS6_3F_400x400.jpg",
				id: "Test_Button",
				name: "Github",
				text_align: "left",
				type: "Button",
			},
			{
				click_function: 'window.open("https://discord.gg/BgxvVqap4G");',
				color: "#e60005ff",
				description: "Description of this Button",
				font_size: 15,
				id: "Test_Button",
				name: "❗Report bugs / Issues❗\n",
				text_align: "center",
				type: "Button",
			},
		],
	},
	{
		category: "↕️ Import / Export Theme",
		settings: [
			{
				click_function:
					'await Copy_to_clipboard(await Export_StyleShift_JSON_Text());\n\nCreate_Notification({\nIcon : "✅",\nTitle : "StyleShift",\nContent : "Copied to clipboard!"\n})',
				color: "#1932ffff",
				description: "",
				font_size: 15,
				icon: "",
				id: "",
				name: 'Export "StyleShift Data" (Clipboard)',
				text_align: "center",
				type: "Button",
			},
			{
				click_function: `const Data = await Enter_Text_Prompt({ Title : 'Import_StyleShift Data', Placeholder : 'Paste StyleShift data text here.'});
                    await Import_StyleShift_JSON_Text(Data);
                    `,
				color: "#1932ffff",
				description: "",
				font_size: 15,
				icon: "",
				id: "",
				name: 'Import "StyleShift Data"',
				text_align: "center",
				type: "Button",
			},
		],
	},
];

export function Get_StyleShift_Default_Items() {
	return Default_StyleShift_Items;
}
