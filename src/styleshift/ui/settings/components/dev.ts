import { HEX_to_RBG, RGB_to_HSV, HSV_to_RGB, ReArrange_Selector } from "../../../build-in-functions/normal";
import { Save_All } from "../../../core/save";
import { UI_Preset } from "../../../settings/default-items";
import { Add_Setting } from "../../../settings/items";
import { Setting } from "../../../types/store";
import { Settings_UI } from "../setting-components";
import { Main_Setting_UI } from "./main";

export const Developer_Setting_UI = {
	["Setting_Developer_Text_Editor"]: async function (
		Parent: HTMLElement,
		This_Setting,
		this_property,
		Update_UI = function (value) {}
	) {
		const Main_UI = Settings_UI["Setting_Frame"](true, true);
		Main_UI.className += " STYLESHIFT-Config-Sub-Frame";

		const Text_Editors = {};

		for (const [Title, Property] of Object.entries(this_property)) {
			Main_UI.append(Settings_UI["Sub_Title"](Title));
			const Setting_Developer_Text_Editor = Settings_UI["Text_Editor"](This_Setting, Property);
			Setting_Developer_Text_Editor.Additinal_OnChange(Update_UI);
			Main_UI.append(Setting_Developer_Text_Editor.Text_Editor);
			Text_Editors[Title] = Setting_Developer_Text_Editor;
		}

		Parent.appendChild(Main_UI);

		return { Main_UI, Text_Editors };
	},

	["Setting_Developer_Frame"]: async function (
		Parent,
		This_Setting,
		RunType,
		ext_array = ["function", "css"],
		Update_Config
	) {
		let This_RunType_Name = RunType;
		let Color = "#999999";

		switch (RunType) {
			case "var":
				This_RunType_Name = "Variable";
				Color = "#FFA500";
				break;

			case "click":
				This_RunType_Name = "On Click";
				Color = "#00DFFF";
				break;

			case "constant":
				This_RunType_Name = "Constant CSS";
				Color = "#09ff00";
				break;

			case "ui":
				This_RunType_Name = "UI";
				Color = "#3232FF";
				break;

			case "setup":
				This_RunType_Name = "Startup Script";
				Color = "#3232FF";
				break;

			case "enable":
				This_RunType_Name = "On Enable";
				Color = "#32CD32";
				break;

			case "disable":
				This_RunType_Name = "On Disable";
				Color = "#FF3232";
				break;

			case "update":
				This_RunType_Name = "On Change";
				Color = "#FF00F5";
				break;

			default:
				break;
		}

		const { r, g, b } = HEX_to_RBG(Color);

		const BG_HSV = RGB_to_HSV({ r, g, b });
		BG_HSV.s /= 2;
		BG_HSV.v /= 3;
		const BG_Color = HSV_to_RGB(BG_HSV);

		const BGT_HSV = RGB_to_HSV({ r, g, b });
		BGT_HSV.s /= 1.5;
		BGT_HSV.v /= 2;
		const BGT_Color = HSV_to_RGB(BGT_HSV);

		const Background_TOP_Color = `${BGT_Color.r},${BGT_Color.g},${BGT_Color.b}`;
		const Background_Color = `${BG_Color.r},${BG_Color.g},${BG_Color.b}`;
		const Border_Color = `${r + 150},${g + 150},${b + 150}`;

		//---------------------------

		const This_Frame = Settings_UI["Setting_Frame"](true, true);
		This_Frame.style.paddingBottom = "10px";
		This_Frame.style.background = `radial-gradient(at center top, rgb(${Background_TOP_Color}), rgb(${Background_Color}, 0.5))`;
		This_Frame.style.border = `rgb(${Border_Color}) 1px solid`;

		//---------------------------

		const Collapsed_Button = await Settings_UI["Collapsed_Button"](This_RunType_Name, Color, This_Frame);
		Collapsed_Button.Button.style.borderBottom = "solid 1px white";

		//---------------------------

		Parent.append(Collapsed_Button.Button);
		Parent.append(This_Frame);

		for (const ext of ext_array) {
			let This_Type_Name;

			switch (ext) {
				case "function":
					This_Type_Name = "JS";
					break;

				case "css":
					This_Type_Name = "CSS";
					break;

				default:
					break;
			}

			This_Frame.append(Settings_UI["Sub_Title"](This_Type_Name));

			if (This_Type_Name == "JS") {
				This_Type_Name = "javascript";
			}

			if (This_Type_Name == "CSS") {
				This_Type_Name = "css";
			}

			await Settings_UI["Code_Editor"](
				This_Frame,
				This_Setting,
				RunType + "_" + ext,
				This_Type_Name,
				RunType == "var" ? 100 : 400
			);
		}

		return This_Frame;
	},

	["Config_Main_Section"]: async function (Parent, This_Setting, Props, Update_UI = function () {}) {
		for (let [Title, Property] of Object.entries(Props) as [string, any]) {
			let Update;

			if (typeof Property != "string") {
				Update = Property[1];
				Property = Property[0];
			} else {
				Update = Update_UI;
			}

			//-----------------------------------

			if (Array.isArray(Update)) {
				const DropDown_Setting = {};

				for (const value of Update) {
					DropDown_Setting[value] = {
						enable_function: function () {
							This_Setting[Property] = value;
							Update_UI();
							Save_All();
						},
					};
				}

				const Dropdown_UI = await Settings_UI["Dropdown"]({
					name: Title,
					value: This_Setting[Property],
					options: DropDown_Setting,
				});

				Dropdown_UI.Frame.className += " STYLESHIFT-Config-Sub-Frame";

				Parent.append(Dropdown_UI.Frame);
				continue;
			}

			//-----------------------------------

			if (Property == "Rainbow") {
				const Checkbox_UI = (
					await Settings_UI["Checkbox"](
						{
							name: Title,
							value: This_Setting.Rainbow,
						},
						function (value) {
							This_Setting.Rainbow = value;
							Update_UI();
							Save_All();
						}
					)
				).Frame;

				Checkbox_UI.className += " STYLESHIFT-Config-Sub-Frame";

				Parent.append(Checkbox_UI);
				continue;
			}

			//-----------------------------------

			if (Property == "color") {
				const Color_UI = (
					await Settings_UI["Color"]({
						name: Title,
						value: This_Setting.color,
						show_alpha_slider: false,
						update_function: function (value) {
							This_Setting.color = value;
							Update_UI();
							Save_All();
						},
					})
				).Frame;

				Color_UI.className += " STYLESHIFT-Config-Sub-Frame";

				Parent.append(Color_UI);
				continue;
			}

			//-----------------------------------

			if (Property == "font_size") {
				const Number_Slide_UI = (
					await Settings_UI["Number_Slide"]({
						name: Title,
						value: This_Setting.font_size,
						update_function: function (value) {
							This_Setting.font_size = value;
							Update_UI();
							Save_All();
						},
					})
				).Frame;

				Number_Slide_UI.className += " STYLESHIFT-Config-Sub-Frame";
				Number_Slide_UI.style.width = "-webkit-fill-available";

				Parent.append(Number_Slide_UI);
				continue;
			}

			//-----------------------------------

			const Text_Editor = await Settings_UI["Setting_Developer_Text_Editor"](Parent, This_Setting, {
				[Title]: Property,
			});

			let Update_function;

			if (typeof Update === "function") {
				Update_function = Update;
			} else if (typeof Update === "object") {
				Update_function = function (value) {
					This_Setting[Property] = value;
					Update_UI();
					Save_All();
				};
			} else {
				return;
			}

			Text_Editor.Text_Editors[Title].Additinal_OnChange(Update_function);
		}
	},

	["Config_Sub_Section"]: async function (Parent, This_Setting, Props) {
		for (let [Title, Property] of Object.entries(Props)) {
			if (Title == "Update_Config") {
				continue;
			}

			switch (Property) {
				case 0:
					Property = ["css", "function"];
					break;
				case 1:
					Property = ["var"];
					break;
				case 2:
					Property = ["css"];
					break;
				case 3:
					Property = ["function"];
					break;
			}

			Settings_UI["Setting_Developer_Frame"](
				Parent,
				This_Setting,
				Title,
				Property as any,
				Props.Update_Config
			);
		}
	},

	["Selector_Text_Editor"]: async function (Parent, This_Category) {
		const Selector_Text_Editor = await Settings_UI["Text_Editor"](This_Category, "Selector");
		Selector_Text_Editor.Text_Editor.className += " STYLESHIFT-Selector-Text-Editor";
		Selector_Text_Editor.ReArrange_Value(function (value: string) {
			return ReArrange_Selector(value);
		});
		Parent.append(Selector_Text_Editor.Text_Editor);
		return Selector_Text_Editor;
	},

	["Setting_Delete_Button"]: async function (Parent, WhenClick, type: "full" | "mini" = "full") {
		const Setting_Delete_Button = await Settings_UI["Button"]({
			name: "🗑️",
			color: "#FF0000",
			text_align: "center",
		});
		Setting_Delete_Button.Button.addEventListener("click", WhenClick);
		Parent.append(Setting_Delete_Button.Button);

		switch (type) {
			case "full":
				Setting_Delete_Button.Button.style.width = "100%";
				break;
			case "mini":
				Setting_Delete_Button.Button.style.width = "30px";
				break;
		}

		return Setting_Delete_Button;
	},

	["Add_Setting_Button"]: async function (Category_Settings: Setting[]) {
		let Current_Dropdown;

		const Add_Button = await Settings_UI["Button"]({
			name: "+",
			color: "#FFFFFF",
			text_align: "center",
			click_function: async function () {
				Add_Button.Button.setAttribute("selecting", "");

				if (Current_Dropdown) {
					Current_Dropdown.Cancel();
					return;
				}
				Current_Dropdown = Settings_UI["Show_Dropdown"](Object.keys(Main_Setting_UI), Add_Button.Button);
				const Selected = await Current_Dropdown.Selection;
				if (Selected) {
					const Get_Preset: any = UI_Preset.filter((This_Preset) => This_Preset.type == Selected)[0];

					if (Get_Preset) {
						await Add_Setting(Category_Settings, Get_Preset);
					}
				}
				Current_Dropdown = null;

				Add_Button.Button.removeAttribute("selecting");
			},
		});

		Add_Button.Button.className += " STYLESHIFT-Add-Setting-Button";
		Add_Button.Button.style.borderRadius = "1000px";
		return Add_Button;
	},
};
