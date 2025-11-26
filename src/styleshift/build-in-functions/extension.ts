import { Convert_To_Export_Setting } from "../core/export-converter";
import { Save_And_Update_ALL, JSzip } from "../core/extension";
import { StyleShift_Allowed_Keys, Saved_Data, Set_Null_Save, Load, Save } from "../core/save";
import { StyleShift_Station } from "../run";
import { StyleShift_Category_List } from "../settings/default-items";
import { Show_StyleSheet, Hide_StyleSheet } from "../settings/style-sheet";
import { Category, Setting } from "../types/store";
import { Notification_Container, Run_Animation, Create_StyleShift_Window } from "../ui/extension";
import { Settings_UI } from "../ui/settings/setting-components";
import { sleep, deepClone, Download_File, Get_Current_Domain, Create_UniqueID } from "./normal";

/*
-------------------------------------------------------
For Normal user !!!
-------------------------------------------------------
*/

/**
 * Copies text to the clipboard.
 * @param {string} text - The text to copy.
 * @returns {boolean}
 * @example
 * Copy_to_clipboard("Hello, world!"); // Copies "Hello, world!" to the clipboard
 */
export function Copy_to_clipboard(text: string) {
	navigator.clipboard.writeText(text).then(
		() => {
			return true;
		},
		(err) => {
			console.error("Failed to copy text: ", err);
			return false;
		}
	);
}

/**
 * Creates a notification.
 * @param {Object} options - The notification options.
 * @param {string} [options.Icon=null] - The icon.
 * @param {string} [options.Title="StyleShift"] - The title.
 * @param {string} [options.Content=""] - The content.
 * @param {number} [options.Timeout=3000] - The timeout in milliseconds.
 * @returns {Promise<Object>}
 * @example
 * await Create_Notification({ Title: "Hello", Content: "This is a notification" });
 */
export async function Create_Notification({ Icon = null, Title = "StyleShift", Content = "", Timeout = 3000 }) {
	// console.log(Title, Content);

	const Notification_Frame = await Settings_UI["Setting_Frame"](true, false, {
		x: false,
		y: true,
	});

	Notification_Frame.className = "STYLESHIFT-Notification";
	setTimeout(() => {
		Notification_Container.append(Notification_Frame);
	}, 1);

	let Icon_UI;

	if (Icon) {
		Icon_UI = await Settings_UI["Setting_Frame"](true, false, {
			x: true,
			y: true,
		});
		Icon_UI.className += " STYLESHIFT-Notification-Icon";
		Icon_UI.textContent = Icon;
		Notification_Frame.append(Icon_UI);
	}

	//---------------------------------

	const Notification_Content_Frame = await Settings_UI["Setting_Frame"](false, true);
	Notification_Content_Frame.className += " STYLESHIFT-Notification-Content-Frame";
	Notification_Frame.append(Notification_Content_Frame);

	const Title_UI = await Settings_UI["Setting_Frame"](true, false, {
		x: false,
		y: true,
	});
	Title_UI.className += " STYLESHIFT-Notification-Title";
	Title_UI.textContent = Title;
	Notification_Content_Frame.append(Title_UI);

	const Content_UI = await Settings_UI["Setting_Frame"](true, false, {
		x: false,
		y: true,
	});
	Content_UI.className += " STYLESHIFT-Notification-Content";
	Notification_Content_Frame.append(Content_UI);

	const Set_Content = (New_Content) => {
		New_Content = String(New_Content);
		Content_UI.innerHTML = New_Content.replaceAll("<script", "").replaceAll("/script>", "");
	};

	Set_Content(Content);

	//---------------------------------

	async function Close() {
		await Run_Animation(Notification_Frame, "Notification-Hide");
		Notification_Frame.remove();
	}

	if (Timeout == 0) {
		const Close_UI = await Settings_UI["Setting_Frame"](true, false, {
			x: true,
			y: true,
		});
		Close_UI.className += " STYLESHIFT-Notification-Close";
		Close_UI.textContent = "X";
		Notification_Frame.append(Close_UI);

		Close_UI.addEventListener("click", function (e) {
			e.preventDefault();
			Close();
		});
	}

	//---------------------------------

	await Run_Animation(Notification_Frame, "Notification-Show");
	setTimeout(async () => {
		if (Timeout > 0) {
			await sleep(Timeout);
			Close();
		}
	}, 0);

	return {
		Set_Icon: (New_Icon) => {
			if (Icon_UI) {
				Icon_UI.textContent = New_Icon;
			}
		},
		Set_Content,
		Set_Title: (New_Title) => {
			Title_UI.textContent = New_Title;
		},
		Close,
	};
}

/**
 * Creates an error notification.
 * @param {string} Content - The error content.
 * @returns {Promise<Object>}
 * @example
 * await Create_Error("An error occurred");
 */
export async function Create_Error(Content, Timeout = 0) {
	console.error("StyleShift - " + Content);
	return await Create_Notification({
		Icon: "❌",
		Title: "StyleShift - Error",
		Content: Content,
		Timeout: Timeout,
	});
}

export async function Create_Warning(Content, { Timeout = 0, Show = true } = {}) {
	console.warn("StyleShift - " + Content);
	if (!Show) return;
	return await Create_Notification({
		Icon: "⚠️",
		Title: "StyleShift - Warning",
		Content: Content,
		Timeout: Timeout,
	});
}

/*
-------------------------------------------------------
For advanced user !!!
-------------------------------------------------------
*/
/**
 * Shows a text input prompt window.
 * @param {{ Title : string, Placeholder : string, Content : string }} Options
 * @returns {Promise<string>}
 * @example
 * await Enter_Text_Prompt({ Title : "Enter your name", Placeholder : "John Doe", Content : "Please enter your name." });
 */
export async function Enter_Text_Prompt({ Title = "Enter text", Placeholder = "", Content = "" }) {
	const StyleShift_Window = await Create_StyleShift_Window({
		Width: "40%",
		Height: "70%",
	});

	StyleShift_Window.BG_Frame.style.background = "";
	StyleShift_Window.BG_Frame.style.pointerEvents = "";
	StyleShift_Window.BG_Frame.style.zIndex = "10001";

	const Content_Window = StyleShift_Window.Window;

	//---------------------------------

	const Header = await Settings_UI["Text"]({
		type: "Text",
		html: Title,
		font_size: 20,
		text_align: "center",
	});
	Dynamic_Append(Content_Window, Header);

	//---------------------------------

	const Text_Input = await Settings_UI["Text_Editor"]();
	Text_Input.OnChange(() => {});
	Text_Input.Text_Editor.style.height = "inherit";
	Content_Window.append(Text_Input.Text_Editor);

	//---------------------------------

	const Button_Frame = await Settings_UI["Setting_Frame"](true, false);
	Button_Frame.style.gap = "10px";
	Dynamic_Append(Content_Window, Button_Frame);

	//---------------------------------

	const OK_Button = await Settings_UI["Button"]({
		name: "OK",
		color: "#00ff00",
		text_align: "center",
	});
	Dynamic_Append(Button_Frame, OK_Button);

	//---------------------------------

	const Cancel_Button = await Settings_UI["Button"]({
		name: "Cancel",
		color: "#ff0000",
		text_align: "center",
	});
	Dynamic_Append(Button_Frame, Cancel_Button);

	return new Promise((resolve, reject) => {
		OK_Button.Button.addEventListener("click", () => {
			StyleShift_Window.Run_Close();
			resolve(Text_Input.Text_Editor.value);
		});
		Cancel_Button.Button.addEventListener("click", () => {
			StyleShift_Window.Run_Close();
			reject();
		});
	});
}

/**
 * Prompts the user to select a file.
 * @param {string} type - The file type.
 * @returns {Promise<File>}
 * @example
 * const file = await Get_File(".txt");
 */
export async function Get_File(type) {
	return new Promise((resolve, reject) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = type;

		input.click();

		input.addEventListener("change", function () {
			const file = input.files[0];
			if (file) {
				resolve(file);
			} else {
				reject(new Error("No file selected"));
			}
		});

		input.addEventListener("cancel", () => {
			reject(new Error("Canceled by the user"));
		});
	});
}

/**
 * Imports StyleShift data and updates the saved data.
 * @param {Object} StyleShift_Data - The JSON data to import.
 * @returns {Promise<void>}
 * @example
 * await Import_StyleShift_Data(data);
 */
export async function Import_StyleShift_Data(StyleShift_Data: object) {
	const Notification = await Create_Notification({
		Icon: "🔄️",
		Title: "StyleShift - Importing data",
		Content: "Please wait...",
		Timeout: -1,
	});

	try {
		for (const This_Key of StyleShift_Allowed_Keys) {
			Saved_Data[This_Key] = StyleShift_Data[This_Key];
		}

		await Set_Null_Save();
		Save_And_Update_ALL();

		Notification.Set_Icon("✅");
		Notification.Set_Title("StyleShift - Imported data");
		Notification.Set_Content("Imported successfully!");

		await sleep(3000);

		Notification.Close();
	} catch (error) {
		Notification.Close();

		Create_Error(error).then((Notification) => {
			Notification.Set_Title("StyleShift - Import Failed");
		});
	}
}

/**
 * Exports custom items.
 * @returns {Object[]}
 * @example
 * const items = Export_StyleShift_Data();
 */
export function Export_StyleShift_Data() {
	const Export_StyleShift_Data = {};

	for (const This_Key of StyleShift_Allowed_Keys) {
		if (Saved_Data[This_Key]) {
			Export_StyleShift_Data[This_Key] = deepClone(Saved_Data[This_Key]);
		}
	}

	const custom_items = Export_StyleShift_Data["Custom_StyleShift_Items"];

	if (custom_items) {
		for (const This_Category of custom_items) {
			delete This_Category.Highlight_Color;
			delete This_Category.Editable;

			for (const This_Setting of This_Category.Settings) {
				delete This_Setting.Editable;
			}
		}
	} else {
		Create_Warning("No custom items found. Skipping...", { Show: false });
	}

	return Export_StyleShift_Data;
}

/**
 * Imports StyleShift data from a JSON string.
 * @param {string} Text - The JSON string to import.
 * @returns {Promise<void>}
 * @example
 * const json = '{"Custom_StyleShift_Items":[{"Category":"Test","Settings":[{"type":"Text","id":"test_text","html":"<p>Test</p>"}]}]}';
 * await Import_StyleShift_JSON_Text(json);
 */
export async function Import_StyleShift_JSON_Text(Text) {
	await Import_StyleShift_Data(JSON.parse(Text));
}

/**
 * Exports custom items as a JSON string.
 * @returns {string}
 * @example
 * const json = Export_StyleShift_JSON_Text();
 */
export function Export_StyleShift_JSON_Text() {
	return JSON.stringify(Export_StyleShift_Data(), null, 2);
}

/**
 * Imports StyleShift data from a ZIP file.
 * @param {File} zipFile - The ZIP file.
 * @returns {Promise<Category[]>}
 * @example
 * const data = await Import_StyleShift_Zip(file);
 */
export async function Import_StyleShift_Zip(zipFile) {
	const zip = new JSzip();

	const loaded_zip = await zip.loadAsync(zipFile, {
		createFolders: true,
	});

	const Custom_StyleShift_Items: Category[] = [];

	const Category_Folders = Object.keys(loaded_zip.files).filter((path) => {
		const Path_Array = path.split("/");
		if (Path_Array.length === 2 && Path_Array[1] == "") {
			return true;
		}
	});

	for (const Category_Path of Category_Folders) {
		const Category_Path_Name = Category_Path.slice(0, -1);
		const Category_Array = Category_Path_Name.split(" - ");
		const Category_Index = Number(Category_Array[0]);

		const Category_Config = loaded_zip.file(`${Category_Path_Name}/Config.json`);

		const ConfigContent = await Category_Config.async("string");
		const Category_Data = JSON.parse(ConfigContent);

		const Settings: Setting[] = [];

		for (const Setting_Path of Object.keys(loaded_zip.files)) {
			if (
				Setting_Path.split("/").length === 3 &&
				Setting_Path.startsWith(`${Category_Path_Name}/`) &&
				Setting_Path.endsWith("/")
			) {
				const Setting_Path_Name = Setting_Path.slice(Category_Path.length, -1);

				const Setting_Array = Setting_Path_Name.split(" - ");
				const Setting_Index = Number(Setting_Array[0]);

				const Setting_Data =
					JSON.parse(await loaded_zip.file(`${Setting_Path}Config.json`).async("string")) || {};

				for (const Setting_Property_Path of Object.keys(loaded_zip.files)) {
					if (
						Setting_Property_Path.split("/").length === 3 &&
						Setting_Property_Path.startsWith(Setting_Path) &&
						!Setting_Property_Path.endsWith("/") &&
						!Setting_Property_Path.endsWith("Config.json")
					) {
						const Setting_Property_Name = Setting_Property_Path.slice(
							Setting_Path.length,
							Setting_Property_Path.lastIndexOf(".")
						);

						console.log(Setting_Property_Path);

						Setting_Data[Setting_Property_Name] = await loaded_zip
							.file(Setting_Property_Path)
							.async("string");
					}
				}

				Settings[Setting_Index] = Setting_Data;
			}
		}

		// clear null settings
		Category_Data["Settings"] = Settings.filter((setting) => setting !== null);

		Custom_StyleShift_Items[Category_Index] = Category_Data;
	}

	const StyleShift_Data = {
		Custom_StyleShift_Items,
	};

	console.log(StyleShift_Data);

	await Import_StyleShift_Data(StyleShift_Data);
}

/**
 * Exports StyleShift data as a ZIP file.
 * @param {Object} StyleShift_Data - The JSON data.
 * @param {string} zipFileName - The ZIP file name.
 * @returns {Promise<void>}
 * @example
 * await Export_StyleShift_Zip(data, "styleshift.zip");
 */
export async function Export_StyleShift_Zip(StyleShift_Data, zipFileName) {
	console.log("Data", StyleShift_Data);

	const zip = new JSzip();

	for (const [Category_index, This_Category] of StyleShift_Data.entries()) {
		const Renamed_Category = (This_Category.Category || "Untitled Category").replace(/\/|\n/g, "_");
		const Category_Folder = zip.folder(`${Category_index} - ${Renamed_Category}`);

		const Category_Config = {};

		for (const [key, value] of Object.entries(StyleShift_Category_List)) {
			if (key !== "Settings") {
				if (This_Category[key]) {
					Category_Config[key] = This_Category[key];
				} else {
					Category_Config[key] = value;
				}
			}
		}

		Category_Folder.file("Config.json", JSON.stringify(Category_Config, null, 2));

		if (This_Category.Settings) {
			for (const [Setting_index, Original_Setting] of This_Category.Settings.entries()) {
				console.log(Original_Setting);

				const Renamed_Setting_Name = (
					Original_Setting.name ||
					Original_Setting.id ||
					"Untitled Setting"
				).replace(/\/|\n/g, "_");

				const This_Setting = deepClone(Original_Setting);
				const Settings_Folder = Category_Folder.folder(`${Setting_index} - ${Renamed_Setting_Name}`);

				await Convert_To_Export_Setting(This_Setting, async (File_Name, File_Data) => {
					Settings_Folder.file(File_Name, File_Data);
				});

				Settings_Folder.file("Config.json", JSON.stringify(This_Setting, null, 2));
			}
		}
	}

	const zipBlob = await zip.generateAsync({ type: "blob" });
	Download_File(zipBlob, zipFileName);
}

/**
 * Appends a child element to a parent HTMLDivElement.
 *
 * This function dynamically appends a child element to the specified parent
 * based on the properties of the child. If the child has a `Frame` property,
 * it appends the frame. If the child has a `Button` property, it appends the
 * button. Otherwise, it appends the child element itself.
 *
 * @param {HTMLDivElement} Parent - The parent element to which the child will be appended.
 * @param {Object} Child - The child element or object with specific properties (`Frame` or `Button`).
 */
export function Dynamic_Append(Parent: HTMLDivElement, Child: object | any) {
	const element = Dynamic_Get_Element(Child);
	if (element) {
		Parent.appendChild(element);
	}
}

/**
 * Retrieves a specific element from a given object.
 *
 * This function checks the provided object for specific properties
 * (`Frame` or `Button`) and returns the corresponding element if found.
 * If neither property is present, it returns the object itself.
 *
 * @param {Object} Child - The object containing potential elements.
 * @returns {HTMLElement | Object} The element associated with the `Frame` or `Button`
 * property, or the object itself if neither property is found.
 */

export function Dynamic_Get_Element(Child: object | any) {
	if (Child.Frame) {
		return Child.Frame;
	}

	if (Child.Button) {
		return Child.Button;
	}

	return Child;
}

/**
 * Opens the StyleShift settings page.
 *
 * This function opens the StyleShift settings page in a new tab by calling
 * window.open with the URL of the settings page.
 *
 * @example
 * Open_Setting_Page();
 */
export function Open_Setting_Page() {
	window.open(chrome.runtime.getURL(`setting/styleshift.html?domain=${Get_Current_Domain()}`), "_blank");
}

/*
-------------------------------------------------------
Danger Zone !!!
-------------------------------------------------------
*/

/**
 * Enables the extension.
 * @example
 * Enable_Extension_Function();
 */
export async function Enable_Extension_Function() {
	Show_StyleSheet();
}

/**
 * Disables the extension.
 * @example
 * Disable_Extension_Function();
 */
export async function Disable_Extension_Function() {
	Hide_StyleSheet();
}

/**
 * Retrieves the StyleShift value associated with a given ID.
 *
 * This function takes an ID, uses the Load function to retrieve the associated
 * data, and returns the data as a JSON string.
 *
 * @param {string} id - The unique identifier for the data to be retrieved.
 * @returns {Promise<string>} The JSON string representation of the retrieved data.
 */
export async function Load_StyleShift_Value(id) {
	return JSON.stringify(await Load(id));
}

/**
 * Saves the StyleShift value associated with a given ID.
 *
 * This function takes an ID and a JSON string value, parses the JSON string,
 * and saves the resulting data under the specified ID using the Save function.
 *
 * @param {string} id - The unique identifier for the data to be saved.
 * @param {string} value - The JSON string representing the data to be saved.
 * @returns {Promise<any>} The result of the save operation.
 */

export async function Save_StyleShift_Value(id, value: string) {
	return await Save(id, JSON.parse(value));
}

/**
 * Creates a setting UI element from the given type and setting.
 *
 * This function will create a UI element using the provided type and setting.
 * The UI element will be appended to the `StyleShift_Station` element and
 * assigned a unique "styleshift-ui-id" attribute.
 *
 * @param {string} type - The type of the setting UI element.
 * @param {Setting | any} This_Setting - The setting associated with the UI element.
 * @param {...any} args - Additional arguments to pass to the UI element function.
 * @returns {Promise<string>} The value of the "styleshift-ui-id" attribute assigned to the UI element.
 */
export async function _Create_StyleShift_Setting_UI(type, This_Setting: Setting | any, ...args) {
	const UI = await Settings_UI[type](This_Setting, ...args);

	let UI_ELement;
	if (typeof UI === "object") {
		UI_ELement = Dynamic_Get_Element(UI);
	} else {
		UI_ELement = UI;
	}

	const id = Create_UniqueID(10);
	UI_ELement.setAttribute("styleshift-ui-id", id);

	StyleShift_Station.append(UI_ELement);

	return id;
}
