import { Save_Any } from "../../core/save";
import { Advance_Setting_UI } from "./components/advance";
import { Developer_Setting_UI } from "./components/dev";
import { Main_Setting_UI } from "./components/main";

export async function Set_And_Save(This_Setting, value) {
	// This_Setting.value = value;
	// await Save_All();
	await Save_Any(This_Setting.id, value);
}

export const Settings_UI = {
	...Main_Setting_UI,
	...Advance_Setting_UI,
	...Developer_Setting_UI,
};
