import { sleep } from "../build-in-functions/normal";
import { Run_Text_Script_From_Setting } from "../core/extension";
import { Load_Any } from "../core/save";
import { Setting } from "../types/store";
import { Create_StyleSheet } from "./style-sheet";

export let Settings_Current_State = {};
let Settings_Update_Function: { [key: string]: Function } = {};

let Settings_On_Update: { [key: string]: Function[] } = {};
let Settings_On_Init: { [key: string]: Function[] } = {};

let Settings_Funcion = {
	["Checkbox"]: async function (This_Setting) {
		let StyleSheet: HTMLElement;
		if (This_Setting.constant_css || This_Setting.enable_css || This_Setting.disable_css) {
			StyleSheet = Create_StyleSheet(This_Setting.id);
		}

		if (This_Setting.setup_function) {
			Run_Text_Script_From_Setting(This_Setting, "setup_function");
		}

		async function Update_Function() {
			let value = await Load_Any(This_Setting.id);

			if (StyleSheet) {
				StyleSheet.textContent = This_Setting.constant_css || ``;
			}

			if (value) {
				if (StyleSheet) {
					StyleSheet.textContent += This_Setting.enable_css || ``;
				}
			} else {
				if (StyleSheet) {
					StyleSheet.textContent += This_Setting.disable_css || ``;
				}
			}

			if (Settings_Current_State[This_Setting.id] == value) return;
			Settings_Current_State[This_Setting.id] = value;

			if (value) {
				if (This_Setting.enable_function) {
					Run_Text_Script_From_Setting(This_Setting, "enable_function");
				}
			} else {
				if (This_Setting.disable_function) {
					Run_Text_Script_From_Setting(This_Setting, "disable_function");
				}
			}
		}

		Update_Function();

		return Update_Function;
	},
	["Number_Slide"]: async function (This_Setting: Partial<Extract<Setting, { type: "Number_Slide" }>>) {
		let StyleSheet: HTMLElement;
		if (This_Setting.constant_css || This_Setting.var_css) {
			StyleSheet = Create_StyleSheet(This_Setting.id);
		}

		if (This_Setting.setup_function) {
			Run_Text_Script_From_Setting(This_Setting, "setup_function");
		}

		async function Update_Function() {
			let value = await Load_Any(This_Setting.id);

			if (StyleSheet) {
				StyleSheet.textContent = "";
				StyleSheet.textContent += `:root{${
					This_Setting.var_css ? This_Setting.var_css : `--${This_Setting.id}`
				}: ${value}px}`;
				if (This_Setting.constant_css) {
					StyleSheet.textContent += This_Setting.constant_css;
				}
			}

			// if (Settings_Current_State[This_Setting.id] == value) return;
			Settings_Current_State[This_Setting.id] = value;

			if (This_Setting.update_function) {
				Run_Text_Script_From_Setting(This_Setting, "update_function");
			}
		}

		Update_Function();

		return Update_Function;
	},
	["Dropdown"]: async function (This_Setting: Partial<Extract<Setting, { type: "Dropdown" }>>) {
		let StyleSheet: HTMLElement;
		StyleSheet = Create_StyleSheet(This_Setting.id);

		if (This_Setting.setup_function) {
			Run_Text_Script_From_Setting(This_Setting, "setup_function");
		}

		async function Update_Function() {
			let value = await Load_Any(This_Setting.id);

			if (Settings_Current_State[This_Setting.id] == value) return;

			//----------------------

			const Old_Dropdown = This_Setting.options[Settings_Current_State[This_Setting.id]];
			Run_Text_Script_From_Setting(This_Setting, "disable_function");

			//----------------------

			Settings_Current_State[This_Setting.id] = value;
			const Current_Dropdown = This_Setting.options[value];
			Run_Text_Script_From_Setting(This_Setting, "enable_function");

			//----------------------

			StyleSheet.textContent = "";
			if (This_Setting.constant_css) {
				StyleSheet.textContent += This_Setting.constant_css;
			}
			if (Current_Dropdown && Current_Dropdown.enable_css) {
				StyleSheet.textContent += Current_Dropdown.enable_css;
			}
		}

		Update_Function();

		return Update_Function;
	},
	["Color"]: async function (This_Setting: Partial<Extract<Setting, { type: "Color" }>>) {
		let StyleSheet: HTMLElement;

		// if (This_Setting.constant_css) {
		StyleSheet = Create_StyleSheet(This_Setting.id);
		// }

		if (This_Setting.setup_function) {
			Run_Text_Script_From_Setting(This_Setting, "setup_function");
		}

		async function Update_Function() {
			let value = await Load_Any(This_Setting.id);

			//----------------------

			Settings_Current_State[This_Setting.id] = value;

			//----------------------

			if (StyleSheet) {
				StyleSheet.textContent = "";
				StyleSheet.textContent += `:root{${
					This_Setting.var_css ? This_Setting.var_css : `--${This_Setting.id}`
				}: ${value}}`;
				StyleSheet.textContent += This_Setting.constant_css || ``;
			}

			//----------------------

			if (This_Setting.update_function) {
				Run_Text_Script_From_Setting(This_Setting, "update_function");
			}
		}

		Update_Function();

		return Update_Function;
	},
	["Custom"]: async function (This_Setting: Partial<Extract<Setting, { type: "Custom" }>>) {
		let StyleSheet: HTMLElement;
		if (This_Setting.constant_css) {
			StyleSheet = Create_StyleSheet(This_Setting.id);
		}

		if (This_Setting.setup_function) {
			Run_Text_Script_From_Setting(This_Setting, "setup_function");
		}

		async function Update_Function() {
			let value = await Load_Any(This_Setting.id);

			//----------------------

			// if (Settings_Current_State[This_Setting.id] == value) return;
			Settings_Current_State[This_Setting.id] = value;

			//----------------------

			if (StyleSheet) {
				StyleSheet.textContent = This_Setting.constant_css || ``;
			}
		}

		Update_Function();

		return Update_Function;
	},
	["Combine_Settings"]: async function (This_Setting: Partial<Extract<Setting, { type: "Combine_Settings" }>>) {
		let StyleSheet = Create_StyleSheet(This_Setting.id);

		async function Update_Function() {
			if (StyleSheet && This_Setting.update_function) {
				StyleSheet.textContent = This_Setting.update_function;
			}
		}

		Update_Function();
		return Update_Function;
	},
};

export async function SetUp_Setting_Function(This_Setting) {
	if (This_Setting.id == null) return;

	const Get_Update_Function = Settings_Funcion[This_Setting.type];
	if (!Get_Update_Function) return;

	let Update_Function = await Get_Update_Function(This_Setting);
	Settings_Update_Function[This_Setting.id] = Update_Function;

	return Update_Function;
}

let Updating_Setting_Function = {};

export async function Update_Setting_Function(id) {
	switch (Updating_Setting_Function[id]) {
		case "Waiting":
			return;

		case "Updating":
			Updating_Setting_Function[id] = "Waiting";
			await sleep(100);
			Update_Setting_Function(id);

		default:
			Updating_Setting_Function[id] = "Updating";
			if (Settings_Update_Function[id]) await Settings_Update_Function[id]();
			const Current_Value = await Load_Any(id);

			// Run all on_update functions
			if (Settings_On_Update[id]) {
				for (const This_Function of Settings_On_Update[id]) {
					This_Function(Current_Value);
				}
			}

			console.log("Updated", id, Current_Value);
			//----------------------
			await sleep(100);

			if (Updating_Setting_Function[id] == "Updating") {
				delete Updating_Setting_Function[id];
			}
	}
}

export async function On_Setting_Update(id: string, callback: (value) => void, callback_on_init = false) {
	if (Settings_On_Update[id] == null) {
		Settings_On_Update[id] = [];
	}

	Settings_On_Update[id].push(callback);

	if (callback_on_init) {
		if (Settings_On_Init[id] == null) {
			Settings_On_Init[id] = [];
		}
		Settings_On_Init[id].push(callback);
	}
}

export async function Remove_On_Setting_Update(id: string, callback: Function) {
	if (Settings_On_Update[id] == null) return;

	Settings_On_Update[id] = Settings_On_Update[id].filter((This_Function) => This_Function != callback);

	if (Settings_On_Update[id].length == 0) {
		delete Settings_On_Update[id];
	}
}

export async function Run_Setting_Init(id) {
	if (Settings_On_Init[id]) {
		const Current_Value = await Load_Any(id);
		for (const This_Function of Settings_On_Init[id]) {
			This_Function(Current_Value);
		}
	}
}

export async function Run_All_Setting_Init() {
	for (const id in Settings_On_Init) {
		console.log("Running init", id);
		Run_Setting_Init(id);
	}
}
