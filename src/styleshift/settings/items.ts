import { Get_Default_Items } from "../../main/items-default";
import { Get_StyleShift_Default_Items } from "../../main/items-styleshift-default";
import { Random } from "../build-in-functions/normal";
import { Save_And_Update_ALL } from "../core/extension";
import { Load, Save_Any } from "../core/save";
import { Update_All } from "../run";
import { Category, Setting } from "../types/store";
import { SetUp_Setting_Function } from "./functions";

const Highlight_Colors = [`255, 109, 109`, `167, 242, 255`, `255, 167, 248`, `188, 167, 255`, `255, 241, 167`];

const StyleShift_Items: { Default: Category[]; Custom: Category[] } = {
	Default: [],
	Custom: [],
};

export function Get_StyleShift_Items() {
	return StyleShift_Items;
}

export function Get_Custom_Items() {
	return StyleShift_Items.Custom;
}

export function Get_Custom_Settings() {
	return StyleShift_Items.Custom.map((item) => item.settings).flat();
}

export function Get_ALL_StyleShift_Items() {
	return [...StyleShift_Items.Default, ...StyleShift_Items.Custom];
}

export function Get_ALL_StyleShift_Settings() {
	return Get_ALL_StyleShift_Items()
		.map((item) => item.settings)
		.flat();
}

export function Find_Exist_Settings(Setting: Setting) {
	return Get_ALL_StyleShift_Settings().some(
		(This_Setting) =>
			This_Setting.id === Setting.id &&
			//@ts-ignore
			(This_Setting.name == null || This_Setting.name === Setting.name)
	);
}

export function Get_Setting_Category(Setting: Setting) {
	for (const This_Category of Get_ALL_StyleShift_Items()) {
		for (const This_Setting of This_Category.settings) {
			if (This_Setting === Setting) {
				return This_Category;
			}
		}
	}
	return 0;
}

export function Find_Exist_Category(Category: Category) {
	return Get_ALL_StyleShift_Items().some((This_Category) => This_Category.category === Category.category);
}

function Auto_Add_HightLight(Array) {
	for (const Category_OBJ of Array) {
		if (Category_OBJ.Highlight_Color == null) {
			const GetColorID = Random(0, Highlight_Colors.length - 1, Category_OBJ.Category);
			console.log("Random id", Category_OBJ.Category, GetColorID);
			Category_OBJ.Highlight_Color = Highlight_Colors[GetColorID];
		}
	}
}

function Save_Custom_Items_And_Update_All(Custom_Items) {
	Save_Any("Custom_StyleShift_Items", Custom_Items);
	Update_All();
}

export async function Update_StyleShift_Items() {
	StyleShift_Items.Default = [...Get_StyleShift_Default_Items(), ...Get_Default_Items()];
	StyleShift_Items.Custom = (await Load("Custom_StyleShift_Items")) || [];

	Auto_Add_HightLight(Get_ALL_StyleShift_Items());

	// Default

	for (const This_Category of StyleShift_Items.Default) {
		This_Category.editable = false;
	}

	for (const This_Setting of StyleShift_Items.Default.flatMap(function (This_Setting) {
		return This_Setting.settings;
	})) {
		This_Setting.Editable = false;
	}

	// Custom

	for (const This_Category of StyleShift_Items.Custom) {
		This_Category.editable = true;
	}

	for (const This_Setting of StyleShift_Items.Custom.flatMap(function (This_Setting) {
		return This_Setting.settings;
	})) {
		This_Setting.Editable = true;
	}

	console.log("Updated Editable Items", StyleShift_Items);
}

let Settings_List = {} as { [id: string]: Setting };

export async function Get_Settings_List(rebuild = false): Promise<{ [id: string]: Setting }> {
	if (!rebuild && Object.keys(Settings_List).length) {
		return Settings_List;
	}

	Settings_List = {};

	for (const Category_OBJ of Get_ALL_StyleShift_Items()) {
		for (const Setting of Category_OBJ.settings) {
			if ("id" in Setting && Setting.id != null) {
				Settings_List[Setting.id] = Setting;
			}
		}
	}

	return Settings_List;
}

//--------------------------------------------------

export async function Add_Setting(Category_Settings: Setting[], This_Setting) {
	let Find_Similar = Find_Exist_Settings(This_Setting);
	let New_Preset;
	let Times = 0;

	while (Find_Similar) {
		Times++;
		New_Preset = Object.assign({}, This_Setting);
		New_Preset.id += `_${Times}`;
		New_Preset.name += `_${Times}`;
		Find_Similar = Find_Exist_Settings(New_Preset);
		console.log(Find_Similar, Times, New_Preset);
	}

	if (New_Preset) {
		This_Setting = New_Preset;
	}

	Category_Settings.push(This_Setting);
	console.log("Update Category Settings", Category_Settings);

	if (This_Setting.value) {
		await Save_Any(This_Setting.id, This_Setting.value);
	}

	SetUp_Setting_Function(This_Setting);

	Save_And_Update_ALL();
}

export async function Remove_Setting(This_Setting) {
	for (const This_Category of Get_Custom_Items()) {
		const index = (This_Category.settings || []).findIndex((Check_Setting) => Check_Setting === This_Setting);

		if (index > -1) {
			This_Category.settings.splice(index, 1);
		}
	}

	Save_And_Update_ALL();
}

//--------------------------------------------------

export async function Add_Category(Category_Name: string) {
	let This_Category: Category = {
		category: Category_Name,
		settings: [],
	};

	let Find_Similar = Find_Exist_Category(This_Category);
	let New_Category: Category;
	let Times = 0;

	while (Find_Similar) {
		Times++;
		New_Category = Object.assign({}, This_Category);
		New_Category.category += `_${Times}`;
		Find_Similar = Find_Exist_Category(New_Category);
		console.log(Find_Similar, Times, New_Category);
	}

	if (New_Category) {
		This_Category = New_Category;
	}

	const Custom_Items = Get_Custom_Items();
	Custom_Items.push(This_Category);
	console.log("Added Category", Custom_Items);

	Save_Custom_Items_And_Update_All(Custom_Items);
}

export async function Remove_Category(This_Category) {
	const Custom_Items = Get_Custom_Items();

	const index = Custom_Items.findIndex((Check_Category) => Check_Category === This_Category);

	if (index > -1) {
		Custom_Items.splice(index, 1);
	}

	Save_Custom_Items_And_Update_All(Custom_Items);
}

//-------------------------------------------------

export function Get_StyleShift_Data_Type(This_Data) {
	if (This_Data.Category != null) {
		return "Category";
	}

	return "Setting";
}
