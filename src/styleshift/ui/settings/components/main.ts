import { Create_Notification, Create_Error } from "../../../build-in-functions/extension";
import {
	HEX_to_RBG,
	RGB_to_HSV,
	HSV_to_RGB,
	numberWithCommas,
	Once_Element_Remove,
	Create_UniqueID,
} from "../../../build-in-functions/normal";
import {
	Is_Safe_Code,
	Run_Text_Script_From_Setting,
	HEX_to_Color_OBJ,
	Color_OBJ_to_HEX,
	Run_Text_Script,
} from "../../../core/extension";
import { Load_Any, Load, Load_Setting } from "../../../core/save";
import { Update_Setting_Function, Remove_On_Setting_Update, On_Setting_Update } from "../../../settings/functions";
import { Setting } from "../../../types/store";
import { Settings_UI, Set_And_Save } from "../setting-components";
import { Create_Config_UI_Function } from "../settings";

export const Main_Setting_UI = {
	["Text"]: async function (This_Setting: Partial<Extract<Setting, { type: "Text" }>>) {
		let Frame = Settings_UI["Setting_Frame"](true, true);

		//-------------------------------------

		let Text = document.createElement("div");
		Text.className = "STYLESHIFT-Text-Main-Description";

		Frame.append(Text);

		//-------------------------------------

		function Update_UI() {
			Text.id = This_Setting.id;
			Text.style.fontSize = This_Setting.font_size + "px";

			switch (This_Setting.text_align) {
				case "left":
					Text.style.textAlign = "start";
					break;

				case "center":
					Text.style.textAlign = "center";
					break;

				case "right":
					Text.style.textAlign = "end";
					break;

				default:
					break;
			}

			if (Is_Safe_Code(This_Setting.html, This_Setting.id)) {
				Text.innerHTML = This_Setting.html;
			}
		}
		Update_UI();

		//-------------------------------------

		let Config_UI_Function = await Create_Config_UI_Function(This_Setting.Editable, async function (Parent) {
			await Settings_UI["Config_Main_Section"](
				Parent,
				This_Setting,
				{
					Text: "html",

					["Text align"]: ["text_align", ["left", "center", "right"]],
					["Font size"]: "font_size",
				},
				Update_UI
			);
		});

		return { Frame, Config_UI_Function };
	},
	["Setting_Sub_Title"]: async function (This_Setting: Partial<Extract<Setting, { type: "Setting_Sub_Title" }>>) {
		let Frame = Settings_UI["Setting_Frame"](true, true);
		Frame.className = "STYLESHIFT-Setting-Sub-Title";

		//-------------------------------------

		let Text = document.createElement("div");
		Text.className = "STYLESHIFT-Text-Main-Description";

		Frame.append(Text);

		//-------------------------------------

		function Update_UI() {
			Text.style.fontSize = This_Setting.font_size + "px";

			switch (This_Setting.text_align) {
				case "left":
					Text.style.textAlign = "start";
					break;

				case "center":
					Text.style.textAlign = "center";
					break;

				case "right":
					Text.style.textAlign = "end";
					break;

				default:
					break;
			}

			Text.textContent = This_Setting.text;
		}

		Update_UI();

		//-------------------------------------

		let Config_UI_Function = await Create_Config_UI_Function(This_Setting.Editable, async function (Parent) {
			await Settings_UI["Config_Main_Section"](
				Parent,
				This_Setting,
				{
					Text: "text",

					["Text align"]: ["text_align", ["left", "center", "right"]],
					Color: "color",
					["Font size"]: "font_size",
				},
				Update_UI
			);
		});

		return { Frame, Config_UI_Function };
	},

	["Button"]: async function (This_Setting: Partial<Extract<Setting, { type: "Button" }>>) {
		This_Setting.font_size = Number(This_Setting.font_size);

		if (This_Setting.color == null) {
			This_Setting.color = "#ffffff";
		}

		// let Frame = Settings_UI["Setting_Frame"](false, true);

		//-------------------------------------

		let Button = document.createElement("div");
		Button.className = "STYLESHIFT-Button";
		Button.style.borderRadius = "20px";

		// Frame.appendChild(Button);

		//---------------------------------------

		const Image = document.createElement("img");
		Image.className = "STYLESHIFT-Button-Logo";

		Button.append(Image);

		//---------------------------------------

		const Button_Text = document.createElement("div");
		Button_Text.className = "STYLESHIFT-Button-Text";

		Button.append(Button_Text);

		//-------------------------------------

		Button.addEventListener("click", function () {
			if (This_Setting.click_function == null) return;

			if (typeof This_Setting.click_function == "string") {
				Run_Text_Script_From_Setting(This_Setting, "click_function");
			} else {
				This_Setting.click_function();
			}
		});

		//---------------------------------------

		function Update_UI() {
			// Frame.id = This_Setting.id || "";
			Button.id = This_Setting.id || "";

			//-----------------------------------
			let { r, g, b } = HEX_to_RBG(This_Setting.color);

			let BG_HSV = RGB_to_HSV({ r, g, b });
			BG_HSV.s /= 2;
			BG_HSV.v /= 3;
			let BG_Color = HSV_to_RGB(BG_HSV);

			let BGT_HSV = RGB_to_HSV({ r, g, b });
			BGT_HSV.s /= 1.5;
			BGT_HSV.v /= 2;
			let BGT_Color = HSV_to_RGB(BGT_HSV);

			let Background_TOP_Color = `${BGT_Color.r},${BGT_Color.g},${BGT_Color.b}`;
			let Background_Color = `${BG_Color.r},${BG_Color.g},${BG_Color.b}`;
			let Border_Color = `${r + 150},${g + 150},${b + 150}`;

			Button.style.background = `radial-gradient(at center top, rgb(${Background_TOP_Color}), rgb(${Background_Color}, 0.5))`;

			requestAnimationFrame(function () {
				Button.style.borderColor = `rgb(${Border_Color})`;
			});

			//------------------------------------

			if (This_Setting.text_align == null) This_Setting.text_align = "left";

			Button_Text.style.justifyContent = This_Setting.text_align;
			Button_Text.style.color = `rgb(${Border_Color})`;
			Button_Text.textContent = This_Setting.name || "";
			Button_Text.style.fontSize = String(This_Setting.font_size) + "px" || "10px";

			//------------------------------------

			if (This_Setting.icon) {
				Image.style.display = "";
				Image.src = This_Setting.icon;
			} else {
				Image.style.display = "none";
			}

			//------------------------------------

			if (This_Setting.id) Button.id = This_Setting.id;
		}

		Update_UI();

		//-------------------------------------

		Button.addEventListener("click", function () {
			Button.style.transform = "scale(0.95)";
			setTimeout(() => {
				Button.style.transform = "";
			}, 100);
		});

		//-------------------------------------

		let Config_UI_Function = await Create_Config_UI_Function(This_Setting.Editable, async function (Parent) {
			await Settings_UI["Config_Main_Section"](
				Parent,
				This_Setting,
				{
					Id: "id",
					Name: ["name", Button_Text],
					Description: "description",

					Icon: "icon",
					["Text align"]: ["text_align", ["left", "center", "right"]],
					Color: "color",
					["Font size"]: "font_size",
				},
				Update_UI
			);

			//-----------------------------------------------

			await Settings_UI["Config_Sub_Section"](Parent, This_Setting, {
				click: 3,
			});
		});

		return { Button, Config_UI_Function };
	},

	["Checkbox"]: async function (
		This_Setting: Partial<Extract<Setting, { type: "Checkbox" }>>,
		update_function?: Function
	) {
		let Frame = Settings_UI["Setting_Frame"](true, true);

		//-------------------------------------

		let Sub_Frame = Settings_UI["Setting_Frame"](false, false);
		Sub_Frame.setAttribute("settingtype", "Checkbox");
		Frame.append(Sub_Frame);

		//-------------------------------------

		let Checkbox = document.createElement("input");
		Checkbox.type = "Checkbox";
		Checkbox.className = "STYLESHIFT-Checkbox";
		Sub_Frame.appendChild(Checkbox);

		let Setting_Name = Settings_UI["Setting_Name"]("");
		Sub_Frame.appendChild(Setting_Name);

		//-------------------------------------

		async function Update_UI() {
			Frame.id = This_Setting.id || "";

			Setting_Name.textContent = This_Setting.name;

			let value = This_Setting.id ? await Load_Any(This_Setting.id) : This_Setting.value;
			Checkbox.checked = value;
		}
		Update_UI();

		//-------------------------------------

		async function Update_Value(value) {
			if (update_function) update_function(value);

			if (This_Setting.id) {
				await Set_And_Save(This_Setting, value);
				Update_Setting_Function(This_Setting.id);
			}
		}

		//-------------------------------------

		Checkbox.addEventListener("change", async function () {
			let value = Checkbox.checked;
			Update_Value(value);
		});

		//-------------------------------------

		let Config_UI_Function = await Create_Config_UI_Function(This_Setting.Editable, async function (Parent) {
			await Settings_UI["Config_Main_Section"](
				Parent,
				This_Setting,
				{
					Id: "id",
					Name: ["name", Setting_Name],
					Description: "description",
				},
				Update_UI
			);

			//-----------------------------------------------

			await Settings_UI["Config_Sub_Section"](Parent, This_Setting, {
				constant: 2,
				setup: 3,
				enable: 0,
				disable: 0,
			});
		});

		return { Frame, Config_UI_Function };
	},

	["Number_Slide"]: async function (This_Setting: Partial<Extract<Setting, { type: "Number_Slide" }>>) {
		let Frame = Settings_UI["Setting_Frame"](true, true);

		//-------------------------------------

		let Setting_Name;
		if (This_Setting.name) {
			Setting_Name = Settings_UI["Setting_Name"](This_Setting.name, "center");
			Setting_Name.style.marginBottom = "20px";
			Frame.appendChild(Setting_Name);
		}

		//-------------------------------------

		let Sub_Frame = Settings_UI["Setting_Frame"](false, false, { x: false, y: true });
		Sub_Frame.style.gap = "5px";
		Frame.append(Sub_Frame);

		let Number_Slide = Settings_UI["Number_Slide_UI"](Sub_Frame);

		let Number_Input = Settings_UI["Number_Input_UI"](Sub_Frame);

		//-------------------------------------

		async function Update_UI() {
			Frame.id = This_Setting.id || "";

			Number_Slide.Update_Number_Slide(This_Setting.min, This_Setting.max, This_Setting.step);

			if (Setting_Name) {
				Setting_Name.textContent = This_Setting.name;
			}

			let value = This_Setting.id ? await Load_Any(This_Setting.id) : This_Setting.value;
			Number_Slide.Number_Slide_UI.value = String(value);
			Number_Input.value = String(value);
		}
		await Update_UI();

		async function Set_Value(value) {
			This_Setting.value = value;
			await Update_UI();
		}

		//-------------------------------------

		async function Update_Value(value) {
			if (This_Setting.id) {
				await Set_And_Save(This_Setting, value);
				Update_Setting_Function(This_Setting.id);
			} else {
				if (typeof This_Setting.update_function === "function") {
					This_Setting.update_function(value);
				}
			}
		}

		//-------------------------------------

		Number_Slide.Number_Slide_UI.addEventListener("change", async function () {
			let value: any = Number(Number_Slide.Number_Slide_UI.value);
			Number_Input.value = value;

			Update_Value(value);
		});

		Number_Input.addEventListener("change", async function () {
			let value: any = Number(Number_Input.value);
			Number_Input.value = value;
			Number_Slide.Number_Slide_UI.value = value;

			Update_Value(value);
		});

		Number_Slide.Number_Slide_UI.addEventListener("input", async function () {
			if (!(await Load("Realtime_Extension"))) return;
			let value: any = Number(Number_Slide.Number_Slide_UI.value);
			Number_Input.value = value;

			Update_Value(value);
		});

		Number_Input.addEventListener("input", async function () {
			if (!(await Load("Realtime_Extension"))) return;
			let value: any = Number(Number_Input.value);
			Number_Slide.Number_Slide_UI.value = value;

			Update_Value(value);
		});

		Number_Input.addEventListener("keydown", function (event) {
			if (event.key === "Enter") {
				Number_Input.blur();
			}
		});

		//-------------------------------------

		let Config_UI_Function = await Create_Config_UI_Function(This_Setting.Editable, async function (Parent) {
			await Settings_UI["Config_Main_Section"](
				Parent,
				This_Setting,
				{
					Id: "id",
					Name: ["name", Setting_Name],
					Description: "description",

					Min: "min",
					Max: "max",
					Step: "step",
				},
				Update_UI
			);

			//-----------------------------------------------

			await Settings_UI["Config_Sub_Section"](Parent, This_Setting, {
				var: 2,
				constant: 2,
				setup: 3,
				update: 3,
			});
		});

		return { Frame, Config_UI_Function, Set_Value };
	},

	["Dropdown"]: async function (This_Setting: Partial<Extract<Setting, { type: "Dropdown" }>>) {
		let Frame = Settings_UI["Setting_Frame"](true, true);

		//------------------------------

		let SubFrame = Settings_UI["Setting_Frame"](false, false);
		SubFrame.className += " STYLESHIFT-Dropdown-Frame";
		Frame.append(SubFrame);

		//------------------------------

		let Dropdown = await Settings_UI["Button"]({
			name: "",
			color: "#FFFFFF",
			text_align: "center",
		});
		Dropdown.Button.className += " STYLESHIFT-Dropdown";
		SubFrame.appendChild(Dropdown.Button);

		let Setting_Name = Settings_UI["Setting_Name"](This_Setting.name);
		SubFrame.appendChild(Setting_Name);

		//------------------------------

		async function Update_UI() {
			Frame.id = This_Setting.id || "";

			let value = This_Setting.id ? await Load_Any(This_Setting.id) : This_Setting.value;
			Dropdown.Button.textContent = value;
		}
		Update_UI();

		//------------------------------

		async function Update_Value(old_value, value) {
			if (This_Setting.id) {
				await Set_And_Save(This_Setting, value);
				Update_Setting_Function(This_Setting.id);
			} else {
				This_Setting.value = value;

				if (typeof This_Setting.options[old_value].disable_function == "function") {
					This_Setting.options[old_value].disable_function();
				}

				if (typeof This_Setting.options[value].enable_function == "function") {
					This_Setting.options[value].enable_function();
				}
			}
		}

		//------------------------------

		let Current_Dropdown = null;

		Dropdown.Button.addEventListener("click", async function () {
			if (Current_Dropdown) {
				Current_Dropdown.Cancel();
				return;
			}

			//-----------------------

			Current_Dropdown = Settings_UI["Show_Dropdown"](Object.keys(This_Setting.options), Dropdown.Button);

			//-----------------------

			const old_value = This_Setting.id ? await Load_Any(This_Setting.id) : This_Setting.value;
			const value = await Current_Dropdown.Selection;
			Current_Dropdown = null;

			//-----------------------

			if (!value) return;

			//-----------------------

			Update_Value(old_value, value);

			Update_UI();
		});

		//-------------------------------------

		let Config_UI_Function = await Create_Config_UI_Function(This_Setting.Editable, async function (Parent) {
			await Settings_UI["Config_Main_Section"](
				Parent,
				This_Setting,
				{
					Id: "id",
					Name: ["name", Setting_Name],
					Description: "description",
				},
				Update_UI
			);

			//-----------------------------------------------

			await Settings_UI["Config_Sub_Section"](Parent, This_Setting, {
				constant: 2,
				setup: 3,
				enable: 0,
				disable: 0,
			});
		});

		return { Frame, Config_UI_Function };
	},

	["Color"]: async function (This_Setting: Partial<Extract<Setting, { type: "Color" }>>) {
		let Frame = Settings_UI["Setting_Frame"](true, true, { x: false, y: true });

		//-------------------------------------

		let Setting_Name = Settings_UI["Setting_Name"](This_Setting.name, "center");
		Frame.appendChild(Setting_Name);

		//-------------------------------------

		let Sub_Frame = Settings_UI["Setting_Frame"](false, false, { x: false, y: true });
		Sub_Frame.setAttribute("settingtype", "Color");
		Frame.append(Sub_Frame);

		//-------------------------------------

		let Color = document.createElement("input");
		Color.type = "color";
		Color.className = "STYLESHIFT-Color";
		Sub_Frame.appendChild(Color);

		//-------------------------------------

		let Opacity;
		if (This_Setting.show_alpha_slider != false) {
			Opacity = await Settings_UI["Number_Slide"]({
				min: 0,
				max: 100,
				step: 1,
				value: 0,
				update_function: function (value) {
					Update_Value("Alpha", value);
				},
			});

			Opacity.Frame.style.width = "-webkit-fill-available";
			Sub_Frame.appendChild(Opacity.Frame);
		}

		//-------------------------------------

		let Hex_Input = await Settings_UI["Text_Input"]({
			value: "#000000",
			update_function: function (value) {
				var color_obj = HEX_to_Color_OBJ(value);

				Update_Value("HEX", color_obj.HEX);
				Update_Value("Alpha", color_obj.Alpha);
			},
		});
		Frame.append(Hex_Input.Frame);

		//-------------------------------------

		async function Update_UI() {
			Frame.id = This_Setting.id || "";

			Setting_Name.textContent = This_Setting.name;

			let value = This_Setting.id ? await Load_Any(This_Setting.id) : This_Setting.value;
			let Color_Usable_OBJ = HEX_to_Color_OBJ(value);

			Color.value = String(Color_Usable_OBJ.HEX);
			if (Opacity) {
				Opacity.Set_Value(Color_Usable_OBJ.Alpha);
			}

			Hex_Input.Update_UI(value);
		}

		Update_UI();

		async function Update_Config() {
			if (This_Setting.id) {
				Update_Setting_Function(This_Setting.id);
			}
		}

		//-------------------------------------

		async function Update_Value(type: "HEX" | "Alpha", value: any) {
			if (This_Setting.id) {
				let Color_OBJ: any = HEX_to_Color_OBJ(await Load_Any(This_Setting.id));
				Color_OBJ[type] = value;

				await Set_And_Save(This_Setting, Color_OBJ_to_HEX(Color_OBJ));
				Update_Setting_Function(This_Setting.id);
			} else {
				let Color_OBJ: any = HEX_to_Color_OBJ(This_Setting.value);
				Color_OBJ[type] = value;

				This_Setting.value = Color_OBJ_to_HEX(Color_OBJ);

				if (typeof This_Setting.update_function === "function") {
					This_Setting.update_function(This_Setting.value);
				}
			}

			Update_UI();
		}

		//-------------------------------------

		Color.addEventListener("change", async function () {
			Update_Value("HEX", Color.value);
		});

		Color.addEventListener("input", async function () {
			if (!(await Load_Any("Realtime_Extension"))) return;

			Update_Value("HEX", Color.value);
		});

		//-------------------------------------

		let Config_UI_Function = await Create_Config_UI_Function(This_Setting.Editable, async function (Parent) {
			await Settings_UI["Config_Main_Section"](
				Parent,
				This_Setting,
				{
					Id: "id",
					Name: "name",
					Description: "description",
				},
				Update_UI
			);

			//-----------------------------------------------

			await Settings_UI["Config_Sub_Section"](Parent, This_Setting, {
				var: 2,
				constant: 2,
				setup: 3,
				update: 3,
				Update_Config,
			});
		});

		return { Frame, Config_UI_Function };
	},

	["Text_Input"]: async function (This_Setting: Partial<Extract<Setting, { type: "Text_Input" }>>) {
		let Frame = Settings_UI["Setting_Frame"](true, true);

		//-------------------------------------

		let Text_Input = document.createElement("input");
		Text_Input.className = "STYLESHIFT-Text_Input";
		Frame.appendChild(Text_Input);

		//-------------------------------------

		async function Update_UI(value = null) {
			Frame.id = This_Setting.id || "";

			if (value == null) value = This_Setting.id ? await Load_Any(This_Setting.id) : This_Setting.value;

			Text_Input.value = value;
		}
		Update_UI();

		//-------------------------------------

		async function Update_Value(value) {
			if (This_Setting.id) {
				await Set_And_Save(This_Setting, value);
				Update_Setting_Function(This_Setting.id);
			} else {
				if (typeof This_Setting.update_function === "function") {
					This_Setting.update_function(value);
				}
			}
		}

		//-------------------------------------

		Text_Input.addEventListener("change", async function () {
			let value = Text_Input.value;
			Update_Value(value);
		});

		//-------------------------------------

		let Config_UI_Function = await Create_Config_UI_Function(This_Setting.Editable, async function (Parent) {
			await Settings_UI["Config_Main_Section"](
				Parent,
				This_Setting,
				{
					Id: "id",
				},
				Update_UI
			);
		});

		return { Frame, Config_UI_Function, Update_UI };
	},

	["Image_Input"]: async function (This_Setting: Partial<Extract<Setting, { type: "Image_Input" }>>) {
		let Frame = Settings_UI["Setting_Frame"](true, true);

		const Text_Input = (
			await Settings_UI["Text_Input"]({
				type: "Text_Input",
				update_function: async function (value) {},
			})
		).Frame;
		Frame.append(Text_Input);

		const File_Input = Settings_UI["File_Input"](async function (file: File) {
			let Notification = await Create_Notification({
				Icon: "🔃",
				Title: "StyleShift - Loading image!",
				Content: "(╹ڡ╹ )\nLoading image...",
				Timeout: -1,
			});

			const Image_Data: any = await new Promise((resolve, reject) => {
				if (!file.type.startsWith("image/")) {
					Notification.Set_Icon("❌");
					Notification.Set_Title("StyleShift - Failed to load image!");
					Notification.Set_Content("(*￣3￣)╭\nPlease select an image file.");
					setTimeout(() => {
						Notification.Close();
					}, 5000);
					reject(false);
					return;
				}

				if (
					This_Setting.MaxFileSize &&
					file.size > This_Setting.MaxFileSize &&
					!confirm(`⚠️NEWTUBE WARNING!⚠️

Your file size : ${numberWithCommas(file.size)} bytes.
Recommend file size : lower than ${numberWithCommas(This_Setting.MaxFileSize)} bytes.

Your file is quite large. (It may cause lag!)

I recommend do one of these.
- compress file
- (image) resize it
- (image) Use image URL instead 
- Use Upload api (Make this is the last choice)

Are you want to continue?`)
				) {
					return;
				}

				const reader = new FileReader();

				reader.onloadend = function (event) {
					resolve(event.target.result);
				};

				reader.onerror = function (error) {
					Create_Error("Error reading file: " + error);
					reject(false);
				};

				reader.readAsDataURL(file);
			});

			if (!Image_Data) {
				Notification.Set_Icon("❌");
				Notification.Set_Title("StyleShift - Failed to load image!");
				Notification.Set_Content("(っ °Д °;)っ\nImage data is not valid.");
				setTimeout(() => {
					Notification.Close();
				}, 5000);
				return;
			}

			await Set_And_Save(This_Setting, Image_Data);
			Update_Setting_Function(This_Setting.id);

			Notification.Set_Icon("✅");
			Notification.Set_Title("StyleShift - Loaded image!");
			Notification.Set_Content("(/≧▽≦)/ Complete!\n(Please wait if image not showing!)");
			setTimeout(() => {
				Notification.Close();
			}, 5000);
		}, "image/*");
		Frame.append(File_Input);

		//-----------------------------------------------

		let Config_UI_Function = await Create_Config_UI_Function(This_Setting.Editable, async function (Parent) {
			await Settings_UI["Config_Main_Section"](Parent, This_Setting, {
				["Soruce setting Id"]: "id",
			});
		});

		return { Frame, Config_UI_Function };
	},

	["Preview_Image"]: async function (This_Setting: Partial<Extract<Setting, { type: "Preview_Image" }>>) {
		let Frame = Settings_UI["Setting_Frame"](true, true);

		const Image_Frame = document.createElement("img");
		Image_Frame.className = "STYLESHIFT-Preview_Image";
		Frame.appendChild(Image_Frame);

		//-----------------------------------------------

		async function Update_Image(value) {
			Image_Frame.src = value;
		}

		//-----------------------------------------------

		let Old_Source_Id;
		async function Update_UI() {
			if (Old_Source_Id != This_Setting.id) {
				await Remove_On_Setting_Update(Old_Source_Id, Update_Image);
				Old_Source_Id = This_Setting.id;
				if (!This_Setting.id || This_Setting.id == "") return;
				await On_Setting_Update(This_Setting.id, Update_Image);
			}

			Update_Image(await Load_Setting(This_Setting.id));
		}
		Update_UI();

		Once_Element_Remove(Image_Frame, async function () {
			Remove_On_Setting_Update(Old_Source_Id, Update_Image);
		});

		//-----------------------------------------------

		let Config_UI_Function = await Create_Config_UI_Function(This_Setting.Editable, async function (Parent) {
			await Settings_UI["Config_Main_Section"](
				Parent,
				This_Setting,
				{
					["Soruce setting Id"]: "id",
				},
				Update_UI
			);
		});

		return { Frame, Config_UI_Function };
	},

	["Custom"]: async function (This_Setting: Partial<Extract<Setting, { type: "Custom" }>>) {
		let Frame = Settings_UI["Setting_Frame"](true, true);
		Frame.id = This_Setting.id || Create_UniqueID(10);

		if (typeof This_Setting.ui_function === "function") {
			(This_Setting.ui_function as Function)(Frame);
		} else if (typeof This_Setting.ui_function === "string") {
			Run_Text_Script({
				Text: This_Setting["ui_function"],
				Code_Name: `${This_Setting.id} : ui_function`,
				args: JSON.stringify({ Setting_ID: Frame.id }),
			});
		}

		let Config_UI_Function = await Create_Config_UI_Function(This_Setting.Editable, async function (Parent) {
			await Settings_UI["Config_Main_Section"](Parent, This_Setting, {
				Id: "id",
			});

			//-----------------------------------------------

			await Settings_UI["Config_Sub_Section"](Parent, This_Setting, {
				constant: 2,
				setup: 3,
				ui: ["function"],
			});
		});

		return { Frame, Config_UI_Function };
	},

	["Combine_Settings"]: async function (This_Setting: Partial<Extract<Setting, { type: "Combine_Settings" }>>) {
		let Frame = Settings_UI["Setting_Frame"](true, true);
		Frame.setAttribute("settingtype", "Combine_Settings");

		let Config_UI_Function = await Create_Config_UI_Function(This_Setting.Editable, async function (Parent) {
			await Settings_UI["Config_Main_Section"](
				Parent,
				This_Setting,
				{
					Id: "id",
					Name: "name",
					Description: "description",
					["Sync IDs"]: ["sync_id"],
				},
				async function () {
					if (This_Setting.id) {
						Update_Setting_Function(This_Setting.id);
					}
				}
			);

			await Settings_UI["Config_Sub_Section"](Parent, This_Setting, {
				update: 3,
			});
		});

		return { Frame, Config_UI_Function };
	},
};
