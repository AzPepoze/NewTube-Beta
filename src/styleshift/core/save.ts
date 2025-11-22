import { Create_Error } from "../build-in-functions/extension";
import { sleep } from "../build-in-functions/normal";
import { Save_Name } from "../run";
import { Get_Settings_List, Update_StyleShift_Items } from "../settings/items";
import { Show_Confirm } from "../ui/extension";

//Save
export let Saved_Data = {};
let Loaded = false;

export let Save_External = [
	"Current_Settings",
	"Default_StyleShift_Items",
	"Custom_StyleShift_Items",
	"Themes",
	"Enabled_Extension",
	"Realtime_Extension",
	"Developer_Mode",
];

export const StyleShift_Allowed_Keys = ["Current_Settings", "Custom_StyleShift_Items"];

export async function Load_ThisWeb_Save() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(null, function (Saved) {
			console.log("ALL_SAVED", Saved);
		});

		console.log("Loading", Save_Name);

		chrome.storage.local.get(Save_Name, function (Saved: Object) {
			if (Saved[Save_Name]) {
				try {
					Saved_Data = Saved[Save_Name];
					console.log("Loaded", Save_Name, JSON.stringify(Saved_Data));
				} catch {
					Create_Error(`Can't load Data : <b>${Save_Name}</b>`);
					Saved_Data = {};
				}
			} else {
				Saved_Data = {};
			}
			Loaded = true;
			resolve(true);
		});
	});
}

export async function Save(Name, Value, Pre_Save = false) {
	if (!Loaded) {
		await sleep(100);
		return Save(Name, Value);
	}
	Saved_Data[Name] = Value;
	console.log("Save", Name, Value);
	if (!Pre_Save) {
		return await Save_All();
	}
	return true;
}

export async function Save_Setting(Name, Value, Pre_Save = false) {
	if (Saved_Data["Current_Settings"] == null) {
		Saved_Data["Current_Settings"] = {};
	}
	Saved_Data["Current_Settings"][Name] = Value;
	console.log("Save_Setting", Name, Value);
	if (!Pre_Save) {
		return await Save_All();
	}
	return true;
}

export async function Save_Any(Name, Value, Pre_Save = false) {
	if (Save_External.includes(Name)) {
		return await Save(Name, Value, Pre_Save);
	} else {
		return await Save_Setting(Name, Value, Pre_Save);
	}
}

export async function Save_All() {
	console.log("Saving", Save_Name, Saved_Data);
	await chrome.storage.local.set({ [Save_Name]: Saved_Data });
	console.log("Saved", Save_Name, Saved_Data);
	return true;
}

export async function Load(LoadName: string) {
	if (!Loaded) {
		await sleep(100);
		return await Load(LoadName);
	}
	if (LoadName == null) {
		return Saved_Data;
	} else {
		return Saved_Data[LoadName];
	}
}

export async function Load_Setting(LoadName: string) {
	if (!Loaded) {
		await sleep(100);
		return await Load_Setting(LoadName);
	}
	if (Saved_Data["Current_Settings"] != null) {
		return Saved_Data["Current_Settings"][LoadName];
	} else {
		return null;
	}
}

export async function Load_Any(LoadName: string) {
	const Get_Data = await Load_Setting(LoadName);
	if (Get_Data == null) {
		return await Load(LoadName);
	} else {
		return Get_Data;
	}
}

export async function ClearSave() {
	await chrome.storage.local.clear();
}

export async function Update_Save_Default() {
	let Can_Settings = await Get_Settings_List(true);
	let Current_Settings = Saved_Data["Current_Settings"];

	// console.log(Can_Settings);

	if (Current_Settings == null) {
		Current_Settings = {};
	}

	for (const id in Can_Settings) {
		const setting = Can_Settings[id];
		if ("value" in setting && Current_Settings[id] == null) {
			Current_Settings[id] = setting.value;
			console.log("Added New Default Setting:", id, setting.value);
		}
	}

	Saved_Data["Current_Settings"] = Current_Settings;
}

export async function Clear_Unused_Save() {
	if (!Loaded) {
		await sleep(100);
		return await Clear_Unused_Save();
	}

	if (Saved_Data["Current_Settings"] == null) {
		Saved_Data["Current_Settings"] = {};
	}

	console.log("Clearing Unnessary Save");

	let Can_Settings_Keys = Object.keys(await Get_Settings_List(true));
	let Current_Settings = Saved_Data["Current_Settings"];

	for (const key of Object.keys(Current_Settings)) {
		if (!Can_Settings_Keys.includes(key)) {
			console.log("Removed", key);
			delete Current_Settings[key];
		}
	}

	for (const key of Object.keys(Saved_Data)) {
		if (!Save_External.includes(key)) {
			console.log("Removed", key);
			delete Saved_Data[key];
		}
	}

	console.log("Clearing Unnessary Save", "Saving");

	await Save_All();

	console.log("Cleared Unnessary Save");
}

export async function LoadRgba(Text) {
	let HEX = await Load(Text + "C");
	HEX = HEX.replace("#", "");
	let aRgbHex = HEX.match(/.{1,2}/g);
	let aRgb = [parseInt(aRgbHex[0], 16) + "," + parseInt(aRgbHex[1], 16) + "," + parseInt(aRgbHex[2], 16)];

	return `rgba(` + aRgb + `,` + (await Load(Text + "O")) / 100 + `)`;
}

export async function LoadNTubeCode(Preset) {
	let array = Preset;
	let changesMade = false;

	if (Object.prototype.toString.call(array) == "[object Object]") {
		for (let key of Object.keys(array)) {
			let value = array[key];
			if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
				try {
					let TryToParse = JSON.parse(value);
					if (TryToParse != null) {
						value = TryToParse;
					}
				} catch (error) {}
			}

			if (key == "ADDScript" && typeof value === "string" && value.trim() !== "") {
				if (
					await Show_Confirm(
						`⚠️*WARNING*⚠️\nThis Preset/Theme contains JS code.\nYou could be compromised if you continue.\n(Please make sure this code is from a trusted source!)\n\nDo you want to load the JS code?`
					)
				) {
					await Save_Setting(key, value, true);
					changesMade = true;
				} else {
					await Save_Setting(key, "", true);
					changesMade = true;
				}
			} else {
				await Save_Setting(key, value, true);
				changesMade = true;
			}
		}
	} else if (Array.isArray(array)) {
		for (let i = 0; i < array.length; i += 2) {
			let key = array[i];
			let value = array[i + 1];
			if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
				try {
					let TryToParse = JSON.parse(value);
					if (TryToParse != null) {
						value = TryToParse;
					}
				} catch (error) {}
			}
			await Save_Setting(key, value, true);
			changesMade = true;
		}
	}

	if (changesMade) {
		await Save_All();
	}
}

export async function LoadNTubeCodeString(string) {
	console.log(await ConvertStringToPreset(string));
	return await LoadNTubeCode(await ConvertStringToPreset(string));
}

export async function GenNTubeCode() {
	await Update_StyleShift_Items();
	await Clear_Unused_Save();

	return await Load("Current_Settings");
}

export async function GenNTubeCodeString() {
	let arr = await GenNTubeCode();
	let gentext = JSON.stringify(arr).replace(/,"/g, ',\n"');
	gentext = gentext.substring(0, 1) + "\n" + gentext.substring(1);
	let gentextL = gentext.length;
	gentext = gentext.substring(0, gentextL - 1) + "\n" + gentext.substring(gentextL - 1);
	return gentext;
}

export async function ConvertStringToPreset(string) {
	return JSON.parse(string);
}

export async function ConvertToNewSave(Save) {
	let NewSave = { ...Save };

	await Promise.all(
		Object.keys(NewSave).map(async (id) => {
			if (NewSave[id] == "true") {
				NewSave[id] = true;
			}

			if (NewSave[id] == "false") {
				NewSave[id] = false;
			}

			if (id.slice(-1) == "T" && (NewSave[id] === true || NewSave[id] === false)) {
				NewSave[id.slice(0, -1)] = NewSave[id];
				delete NewSave[id];
			}
		})
	);

	return NewSave;
}

export async function Set_Null_Save() {
	let settingsChanged = false;

	if ((await Load("Current_Settings")) == null) {
		await Save("Current_Settings", {}, true);
		settingsChanged = true;
	}

	if ((await Load("Themes")) == null) {
		await Save("Themes", {}, true);
		settingsChanged = true;
	}

	let Current_Settings = await Load("Current_Settings");
	if (Current_Settings == null) Current_Settings = {};

	const allSettingsList = await Get_Settings_List(true);

	for (const [id, args] of Object.entries(allSettingsList) as [string, any]) {
		if (Save_External.includes(id)) continue;

		if (Current_Settings[id] === undefined || Current_Settings[id] === null) {
			console.log("Added New Default Setting:", id, args.value);
			await Save_Any(id, args.value, true);
			settingsChanged = true;
		}
	}

	if (settingsChanged) {
		await Save_All();
		console.log("Finished setting null saves.");
	} else {
		console.log("No null saves needed setting.");
	}
}
