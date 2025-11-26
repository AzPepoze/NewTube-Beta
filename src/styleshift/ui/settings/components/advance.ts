import { Apply_Drag } from "../../../build-in-functions/normal";
import { Monaco, Is_Safe_Code } from "../../../core/extension";
import { Save_All } from "../../../core/save";
import { is_firefox, in_setting_page } from "../../../run";
import { Update_Setting_Function } from "../../../settings/functions";
import { Category } from "../../../types/store";
import { Show_Window_Animation, Hide_Window_Animation, Animation_Time } from "../../extension";
import { Settings_UI } from "../setting-components";
import { Create_Config_UI_Function, Setup_Left_Title_Animation } from "../settings";

export const Advance_Setting_UI = {
	["Fill_Screen"]: function (fill_bg: boolean = true) {
		const Fill_Screen = document.createElement("div");
		Fill_Screen.className = "STYLESHIFT-FillScreen";

		if (fill_bg == false) {
			Fill_Screen.style.background = "transparent";
			Fill_Screen.style.pointerEvents = "none";
		}

		return Fill_Screen;
	},

	["Setting_Frame"]: function (
		padding: boolean = true,
		vertical: boolean = true,
		center: { x: boolean; y: boolean } = { x: false, y: false },
		transparent = false
	) {
		const Frame = document.createElement("div");
		Frame.className = "STYLESHIFT-Setting-Frame";

		if (!padding) {
			Frame.style.padding = "0px";
		}

		if (vertical) {
			Frame.style.flexDirection = "column";
		} else {
			Frame.style.flexDirection = "row";
		}

		if (center.x) {
			Frame.style.justifyContent = "center";
		}

		if (center.y) {
			Frame.style.alignItems = "center";
		}

		if (transparent) {
			Frame.style.background = "transparent";
		}
		return Frame;
	},

	["File_Input"]: function (callback: Function, Type = null) {
		const File_Input = document.createElement("input");
		File_Input.type = "file";
		File_Input.className = "STYLESHIFT-File_Input";

		if (Type) {
			File_Input.accept = Type;
		}

		File_Input.addEventListener("change", function (event: any) {
			const file = event.target.files[0];
			if (file) {
				callback(file);
				File_Input.value = "";
			}
		});

		return File_Input;
	},

	["Text_Editor"]: function (OBJ = {}, key: any = "") {
		const Text_Editor = document.createElement("textarea");
		Text_Editor.className = "STYLESHIFT-Text-Editor";
		Text_Editor.value = OBJ[key] || "";

		let Additinal_OnChange: Function = null;
		let ReArrange_Value: Function = null;

		let OnChange = async function (Value) {
			OBJ[key] = Value;
			Save_All();
			if (Additinal_OnChange) {
				Additinal_OnChange(Value);
			}
		};

		Text_Editor.addEventListener("input", function () {
			OnChange(Text_Editor.value);
		});

		Text_Editor.addEventListener("blur", async function () {
			let Value = Text_Editor.value;
			if (ReArrange_Value) {
				Value = await ReArrange_Value(Value);
				Text_Editor.value = Value;
			}
			OnChange(Text_Editor.value);
		});

		return {
			Text_Editor: Text_Editor,
			OnChange: function (callback) {
				OnChange = callback;
			},
			Additinal_OnChange: function (callback) {
				Additinal_OnChange = callback;
			},
			ReArrange_Value: function (callback) {
				ReArrange_Value = callback;
			},
		};
	},

	["Code_Editor"]: async function (Parent: HTMLDivElement, OBJ, key, language, height = 400) {
		let Code_Editor;
		let Additinal_OnChange: Function = null;
		let ReArrange_Value: Function = null;

		let OnChange = async function (Value: string) {
			OBJ[key] = Value;
			Save_All();

			console.log("OBJ", OBJ);
			if (OBJ["id"]) {
				Update_Setting_Function(OBJ["id"]);
			}

			if (Additinal_OnChange) {
				console.log(Additinal_OnChange);
				Additinal_OnChange(Value);
			}
		};

		if (!is_firefox || in_setting_page) {
			const Editor_Model = Monaco.editor.createModel(OBJ[key], language);

			const Frame = document.createElement("div");
			Frame.style.width = "-webkit-fill-available";
			Frame.style.height = height + "px";
			Frame.style.position = "relative";
			Frame.className += " STYLESHIFT-Code-Editor";
			Parent.append(Frame);

			Code_Editor = Monaco.editor.create(Frame, {
				model: Editor_Model,
				automaticLayout: true,
			});

			Code_Editor.onKeyDown(function () {
				OnChange(Code_Editor.getValue());
			});

			Code_Editor.onDidBlurEditorWidget(async function () {
				let Value = Code_Editor.getValue();
				if (ReArrange_Value) {
					Value = await ReArrange_Value(Value);
					Code_Editor.setValue(Value);
				}
				OnChange(Value);
			});
		} else {
			Code_Editor = Settings_UI["Text_Editor"](OBJ, key);
			Code_Editor.Text_Editor.style.height = height + "px";
			Parent.append(Code_Editor.Text_Editor);

			Code_Editor.OnChange(async function (Value) {
				OnChange(Value);
			});
		}

		return {
			OnChange: function (callback) {
				OnChange = callback;
			},
			Additinal_OnChange: function (callback) {
				Additinal_OnChange = callback;
			},
			ReArrange_Value: function (callback) {
				ReArrange_Value = callback;
			},
		};
	},

	["Setting_Name"]: function (text, position: "left" | "center" | "right" = "left") {
		const Name = document.createElement("div");
		Name.className = "STYLESHIFT-Text-Main-Description";
		Name.textContent = text;

		switch (position) {
			case "left":
				Name.style.textAlign = "start";
				break;

			case "center":
				Name.style.textAlign = "center";
				break;

			case "right":
				Name.style.textAlign = "end";
				break;

			default:
				break;
		}

		return Name;
	},

	["Drag"]: function (Target) {
		const Drag = document.createElement("div");
		Drag.className = "STYLESHIFT-Drag-Top STYLESHIFT-Glow-Hover";
		Drag.innerHTML = "=";

		Apply_Drag(Drag, Target);

		return Drag;
	},

	["Close"]: function () {
		const Close = document.createElement("div");
		Close.className = "STYLESHIFT-Close STYLESHIFT-Glow-Hover";
		Close.innerHTML = "X";

		return Close;
	},

	["Title"]: async function (This_Category: Category) {
		const Frame = document.createElement("div");
		const Base_Class = "STYLESHIFT-Category-Title";
		Frame.className = Base_Class;

		function Update_UI() {
			Frame.className = This_Category.rainbow ? Base_Class + " STYLESHIFT-Category-Title-Rainbow" : Base_Class;
			Frame.innerHTML = This_Category.category;
		}
		Update_UI();

		const Config_UI_Function = await Create_Config_UI_Function(This_Category.editable, async function (Parent) {
			await Settings_UI["Config_Main_Section"](
				Parent,
				This_Category,
				{
					Name: ["Category", Frame],
					Selector: "Selector",
					Rainbow: "Rainbow",
				},
				Update_UI
			);
		});

		return { Frame, Config_UI_Function };
	},

	["Left-Title"]: function (Category, Skip_Animation) {
		const Title = document.createElement("div");
		Title.className = "STYLESHIFT-Left-Category-Title";

		const Text = document.createElement("div");
		Text.className = "STYLESHIFT-Left-Category-Text";
		Text.textContent = Category;

		if (!Skip_Animation) {
			Setup_Left_Title_Animation(Title);
		}

		Title.append(Text);

		return Title;
	},

	["Sub_Title"]: function (Text) {
		const Title = document.createElement("div");
		Title.className = "STYLESHIFT-Sub-Title";

		if (Is_Safe_Code(Text, "Sub_Title")) {
			Title.innerHTML = Text;
		}

		return Title;
	},

	["Collapsed_Button"]: async function (ButtonName, color: string, TargetElement: HTMLElement) {
		TargetElement.setAttribute("STYLESHIFT-All-Transition", "");
		TargetElement.className += " STYLESHIFT-Collapse";

		TargetElement.style.maxHeight = "100%";
		const Save_Style = TargetElement.getAttribute("style");

		function Hide_Function() {
			TargetElement.style.maxHeight = "0px";
			TargetElement.style.padding = "0px";
			TargetElement.style.opacity = "0";
			TargetElement.style.marginTop = "-10px";
			TargetElement.style.pointerEvents = "none";
		}
		function Show_Function() {
			TargetElement.setAttribute("style", Save_Style);
		}

		let Collapsed = true;
		Hide_Function();

		const Button = await Settings_UI["Button"]({
			name: ButtonName,
			color: color,
			click_function: function () {
				if (Collapsed) {
					Show_Function();
				} else {
					Hide_Function();
				}
				Collapsed = !Collapsed;
			},
		});

		return Button;
	},

	["Show_Dropdown"]: function (options, target) {
		const dropdownContainer = Settings_UI["Setting_Frame"](false, true);
		dropdownContainer.className += " STYLESHIFT-DropDown-Container STYLESHIFT-Main";
		Show_Window_Animation(dropdownContainer);

		// Populate dropdown with options

		// Add elements to the DOM
		document.body.appendChild(dropdownContainer);

		let Updating_Position = true;
		const Update_Position_Function = function () {
			if (!Updating_Position) return;
			const targetRect = target.getBoundingClientRect();
			dropdownContainer.style.width = `${targetRect.width}px`;

			const spaceBelow = window.innerHeight - targetRect.bottom;
			const spaceAbove = targetRect.top;

			const Container_Margin = 5;

			if (spaceBelow >= dropdownContainer.offsetHeight) {
				dropdownContainer.style.top = `${targetRect.bottom + Container_Margin}px`;
			} else if (spaceAbove >= dropdownContainer.offsetHeight) {
				dropdownContainer.style.top = `${
					targetRect.top - dropdownContainer.offsetHeight - Container_Margin
				}px`;
			} else {
				// Default to positioning below if neither space is sufficient
				dropdownContainer.style.top = `${targetRect.bottom}px`;
			}
			dropdownContainer.style.left = `${targetRect.left}px`;
			requestAnimationFrame(Update_Position_Function);
		};
		Update_Position_Function();

		async function Remove_DropDown() {
			Updating_Position = false;
			dropdownContainer.dispatchEvent(new Event("Remove_DropDown"));
			await Hide_Window_Animation(dropdownContainer);
			dropdownContainer.remove();
		}

		// Auto remove when mouse moves far away
		let timeout;

		dropdownContainer.addEventListener("mouseenter", () => {
			clearTimeout(timeout);
		});
		return {
			Selection: new Promise((resolve) => {
				timeout = setTimeout(() => {
					Remove_DropDown();
				}, 2000);

				dropdownContainer.addEventListener("mouseleave", () => {
					timeout = setTimeout(() => {
						Remove_DropDown();
					}, 1000);
				});

				dropdownContainer.addEventListener("Remove_DropDown", function () {
					resolve(null);
				});

				let Index = 0;

				for (const option of options as string[]) {
					const listItem = document.createElement("div");
					listItem.className = "STYLESHIFT-DropDown-Items STYLESHIFT-Glow-Hover";
					listItem.textContent = option.replaceAll("_", " ");
					listItem.addEventListener("click", () => {
						resolve(option); // Return the selected option
						Remove_DropDown();
					});
					dropdownContainer.appendChild(listItem);

					//--------------------------------------

					listItem.style.opacity = "0";
					listItem.style.width = "50%";

					setTimeout(() => {
						listItem.style.opacity = "1";
						listItem.style.width = "";
					}, Animation_Time * 100 * Index);

					Index++;
				}
			}),
			Cancel: Remove_DropDown,
		};
	},

	["Number_Slide_UI"]: function (Parent) {
		const Number_Slide_UI = document.createElement("input");
		Number_Slide_UI.type = "range";
		Number_Slide_UI.className = "STYLESHIFT-Number_Slide";
		Parent.appendChild(Number_Slide_UI);

		function Update_Number_Slide(min: any = 0, max: any = 100, step: any = 1) {
			Number_Slide_UI.min = min;
			Number_Slide_UI.max = max;
			Number_Slide_UI.step = step;
		}

		return { Number_Slide_UI, Update_Number_Slide };
	},

	["Number_Input_UI"]: function (Parent) {
		const Number_Input_UI = document.createElement("input");
		Number_Input_UI.type = "number";
		Number_Input_UI.className = "STYLESHIFT-Number_Input";
		Parent.appendChild(Number_Input_UI);
		return Number_Input_UI;
	},

	["Space"]: async function (Parent: HTMLElement, Size = 20) {
		const Space = document.createElement("div");
		Space.className = "STYLESHIFT-Space";
		Space.style.minHeight = `${Size}px`;

		Parent.append(Space);
	},
};
