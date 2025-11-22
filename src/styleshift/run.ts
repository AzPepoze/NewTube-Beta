import { Create_Error, Create_Notification } from "./build-in-functions/extension";
import {
	Get_Current_Domain,
	Get_Current_URL_Parameters,
	GetDocumentBody,
	ReArrange_Selector,
	sleep,
} from "./build-in-functions/normal";
import { Run_Text_Script, Update_StyleShift_Functions_List } from "./core/extension";
import { Clear_Unused_Save, Load, Load_ThisWeb_Save, Save, Save_All, Update_Save_Default } from "./core/save";
import { Run_All_Setting_Init, SetUp_Setting_Function } from "./settings/functions";
import { Create_StyleSheet_Holder } from "./settings/style-sheet";
import { Get_ALL_StyleShift_Items, Get_ALL_StyleShift_Settings, Update_StyleShift_Items } from "./settings/items";
import * as Global from "./communication/extension";
import { Update_All_UI } from "./ui/extension";
import { Extension_Settings_UI } from "./ui/extension-settings";
import { Toggle_Customize } from "./ui/highlight";

//-------------------------------------------------------
// Global Variables & Constants
//-------------------------------------------------------

export let Ver = chrome.runtime.getManifest().version;
export let StyleShift_Ready = false;

export let isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
// console.log("isFirefox", navigator.userAgent.toLowerCase(), isFirefox);

let inIframe;
try {
	inIframe = window.self !== window.top;
} catch (e) {
	inIframe = true;
}

let DefaultYouTubeLogo = `https://www.youtube.com/s/desktop/6588612c/img/favicon.ico`;
let DefaultNewTubeLogo = `https://i.ibb.co/tD2VTyg/1705431438657.png`;

export let Extension_Location = chrome.runtime.getURL("").slice(0, -1);
export let Extension_ID = Extension_Location.slice(19, 0);

export let In_Setting_Page;
if (window.location.origin == Extension_Location) {
	In_Setting_Page = true;
} else {
	In_Setting_Page = false;
}
// console.log("In_Setting_Page", In_Setting_Page);

export let Save_Name;
if (In_Setting_Page) {
	let URL_Parameters = Get_Current_URL_Parameters();
	if (URL_Parameters.domain) {
		Save_Name = URL_Parameters.domain;
	} else {
		Save_Name = "youtube.com";
	}
} else {
	Save_Name = Get_Current_Domain();
}

Global; // This important don't delete

/*
-------------------------------------------------------
 Global Variables & Constants
-------------------------------------------------------
*/
export let StyleShift_Station: HTMLElement = document.createElement("div");
StyleShift_Station.className = "StyleShift-Station";
StyleShift_Station.style.display = "none";

/*
-------------------------------------------------------
 Core Functions
-------------------------------------------------------
*/
export function Update_All() {
	Update_StyleShift_Functions_List();
	Update_StyleShift_Items();
	Update_All_UI();
}

async function Main_Run() {
	// Append StyleShift Station to the body
	setTimeout(async () => {
		(await GetDocumentBody()).append(StyleShift_Station);
	}, 1);

	// Inject build-in functions if not in the settings page
	if (!In_Setting_Page) {
		let Build_in_Functions = await (await fetch(chrome.runtime.getURL("build-in.js"))).text();
		Run_Text_Script({
			Text: Build_in_Functions,
			Replace: false,
		});
	}

	//------------------------------------------
	// Initialization Steps
	//------------------------------------------
	await Load_ThisWeb_Save();

	// Test
	// Saved_Data["Custom_StyleShift_Items"] = Test_Editable_Items;
	// console.log("Test", Saved_Data);
	// await Save_All();

	await Update_StyleShift_Functions_List();
	await Create_StyleSheet_Holder();
	await Update_StyleShift_Items();
	await Update_Save_Default();
	// console.log("Test", Get_ALL_StyleShift_Items());

	//------------------------------------------
	// Apply Settings & Save
	//------------------------------------------
	for (const This_Setting of await Get_ALL_StyleShift_Settings()) {
		if (This_Setting.id == "Themes") {
			continue;
		}
		SetUp_Setting_Function(This_Setting);
	}
	Run_All_Setting_Init();
	await Clear_Unused_Save();

	// ReArrange Selectors
	for (const This_Category of Get_ALL_StyleShift_Items()) {
		if (This_Category.Selector == null) continue;
		This_Category.Selector = ReArrange_Selector(This_Category.Selector);
	}
	await Save_All();

	//------------------------------------------
	// Settings Page Specific UI
	//------------------------------------------
	if (In_Setting_Page) {
		Extension_Settings_UI.Create_UI();
	}

	StyleShift_Ready = true;
}

/*
-------------------------------------------------------
 Main Execution & Error Handling
-------------------------------------------------------
*/
try {
	Main_Run();
} catch (error) {
	Create_Error(error).then((Notification) => {
		Notification.Set_Title("StyleShift - Main run error");
	});
}

/*
-------------------------------------------------------
 Chrome Message Listener
-------------------------------------------------------
*/
chrome.runtime.onMessage.addListener(async function (message) {
	try {
		console.log("Message", message);
		if (message == "Developer") {
			await Save("Developer_Mode", !(await Load("Developer_Mode")));
			if (await Load("Developer_Mode")) {
				await Create_Notification({
					Icon: "🔨",
					Title: "Enabled Developer Mode",
					Timeout: 4000,
				});
			} else {
				await Create_Notification({
					Icon: "✨",
					Title: "Disabled Developer Mode",
					Timeout: 4000,
				});
			}
			Update_All_UI();
		}

		//----------------------------------------------
		// Actions only outside settings page
		//----------------------------------------------
		if (In_Setting_Page) return;

		if (message == "Customize") {
			Toggle_Customize();
		}

		if (message == "Setting") {
			if (!StyleShift_Ready) {
				const loading_notification = await Create_Notification({
					Icon: "⏳",
					Title: "StyleShift is loading! please wait...",
					Timeout: -1,
				});

				while (!StyleShift_Ready) {
					await sleep(100);
				}

				loading_notification.Close();
			}

			Extension_Settings_UI.Toggle();
		}
	} catch (error) {
		Create_Error(error);
	}
});
