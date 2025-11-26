import { Create_Error, Create_Notification } from "../build-in-functions/extension";
import { sleep } from "../build-in-functions/normal";
import { Update_All, in_setting_page, is_firefox } from "../run";
import { color_obj } from "../types/store";
import { Save_All } from "./save";

export async function Save_And_Update_ALL() {
	await Save_All();
	Update_All();
}

let StyleShift_Functions_List = {};

const getFunctionListScript = `
function Run_StyleShift_Functions_List(){

	if(window["StyleShift"] == null) {
		setTimeout(Run_StyleShift_Functions_List, 1);
		return;
	}

	let Get_Functions_List = {};

	for (const [key, value] of Object.entries(window["StyleShift"])) {
		Get_Functions_List[key] = Object.keys(value);
	}

	console.log("Avaliable StyleShift functions", Get_Functions_List);

	window.dispatchEvent(
		new CustomEvent("Sent_StyleShift_Functions_List", {
			detail: Get_Functions_List,
		})
	);
}

Run_StyleShift_Functions_List();`;

export async function Update_StyleShift_Functions_List() {
	if (in_setting_page) {
		while (window["StyleShift"] == null) {
			await sleep(1);
		}

		for (const [key, value] of Object.entries(window["StyleShift"])) {
			StyleShift_Functions_List[key] = Object.keys(value);
		}
		return;
	}

	return new Promise((resolve, reject) => {
		window.addEventListener(
			"Sent_StyleShift_Functions_List",
			function (event) {
				console.log("Recived", event);
				//@ts-ignore
				StyleShift_Functions_List = event.detail;
				resolve(true);
			},
			{ once: true }
		);

		Run_Text_Script({
			Text: getFunctionListScript,
			Replace: false,
		});
	});
}

export async function Get_Global_Data(Mode: "Build-in" | "Custom", Function_Name) {
	if (
		(window["StyleShift"] && window["StyleShift"][Mode] == null) ||
		window["StyleShift"][Mode][Function_Name] == null
	) {
		await sleep(0);
		return await Get_Global_Data(Mode, Function_Name);
	} else {
		console.log(window["StyleShift"][Mode], window["StyleShift"][Mode][Function_Name]);
		return window["StyleShift"][Mode][Function_Name];
	}
}

export function Is_Safe_Code(code: string, Code_Name: string) {
	if (!code) return false;
	const LoweredCase_Code = code.toLowerCase();

	const dangerousPatterns = [
		/eval/i,
		/new function/i,
		/(?<!@)\bimport\b/i,
		/fetch/i,
		/xmlhttprequest/i,
		/xhr/i,
		/<\/?script>/i,
		/document\.createelement\s*\(\s*['"]script['"]\s*\)/i,
		/\.write\s*\(/i,
		/\.execcommand\s*\(/i,
		/\.cookie\s*=/i,
		/localstorage/i,
		/sessionstorage/i,
		/indexeddb/i,
		/opendatabase/i,
		/postmessage/i,
		/sendbeacon/i,
		/importscripts/i,
		/createobjecturl/i,
		/revokeobjecturl/i,
		/webkitrequestfilesystem/i,
		/webkitresolvelocalfilesystemurl/i,
		/showopenfilepicker/i,
		/showsavefilepicker/i,
		/showdirectorypicker/i,
		/new\s+worker\s*\(/i,
		/new\s+sharedworker\s*\(/i,
		/new\s+blob\s*\(/i,
		/url\.createobjecturl\s*\(/i,
		/\.__proto__\s*=/i,
		/\.constructor\s*=/i,
		/javascript:/i,
		/reflect\.(apply|construct|defineproperty|get|set|deleteproperty|ownkeys)/i,
		/globalthis\./i,
		/window\[(["'`"]).*\1\]/i,
		/new\s+eventsource\s*\(/i,
		/webassembly\./i,
		/\.contenteditable\s*=/i,
		/\?callback=/i,
		/new\s+proxy\s*\(/i,
		/function\.prototype\.tostring/i,
		/intl\./i,
		/symbol\./i,
	];

	for (const pattern of dangerousPatterns) {
		if (pattern.test(LoweredCase_Code)) {
			const match = LoweredCase_Code.match(pattern);
			if (match) {
				const matchIndex = match.index;

				const beforeMatch = LoweredCase_Code.slice(0, matchIndex);
				const lineNumber = beforeMatch.split("\n").length;
				const charPosition = matchIndex - beforeMatch.lastIndexOf("\n");

				const codeLines = LoweredCase_Code.split("\n");
				const errorLine = codeLines[lineNumber - 1];

				const isComment = errorLine.replaceAll(" ", "").replaceAll("\t", "").startsWith("//");
				if (isComment) {
					continue;
				}

				const startContext = Math.max(0, charPosition - 15);
				const endContext = Math.min(errorLine.length, charPosition + match[0].length + 15);
				const contextSnippet = errorLine.slice(startContext, endContext);

				const highlightedError = contextSnippet.replace(
					match[0],
					`<span style="color: red; text-decoration: underline;">${match[0]}</span>`
				);

				Create_Notification({
					Icon: "🚫",
					Title: "StyleShift - Error",
					Content: `<b>"${match[0]}"</b> is not allowed.<br>Found at line: <b>${lineNumber}</b>, character: <b>${charPosition}</b><br>From: <b>${Code_Name}</b><br><br><pre>${highlightedError}</pre>`,
					Timeout: 0,
				});

				console.warn(match, pattern);
			}
			return false;
		}
	}

	return true;
}

export async function Run_Text_Script({
	Text = null as string | Function,
	Replace = true,
	Code_Name = "StyleShift",
	args = "",
}) {
	console.log("Trying to run script");
	console.log(Text);

	if (typeof Text == "function") {
		Text();
	} else {
		if (Text != null && Text != "") {
			//--------------------------------

			if (Replace) {
				if (Is_Safe_Code(Text, Code_Name)) {
					for (const [Function_Mode, Functions_List] of Object.entries(StyleShift_Functions_List) as [
						string,
						Array<string>
					][]) {
						for (const Function_Name of Functions_List) {
							Text = Text.replace(
								new RegExp(`\\b${Function_Name}\\b`, "g"),
								`window["StyleShift"]["${Function_Mode}"]["${Function_Name}"]`
							);
						}
					}
				} else {
					return;
				}
			}

			//--------------------------------

			if (!in_setting_page) {
				chrome.runtime.sendMessage({
					Command: "RunScript",
					Script: Text,
					args: args,
				});
			}
		}
	}
}

export function Run_Text_Script_From_Setting(This_Setting, Function_Name: string = "script") {
	Run_Text_Script({
		Text: This_Setting[Function_Name],
		Code_Name: `${This_Setting.id} : ${Function_Name}`,
		args: JSON.stringify({ setting_id: This_Setting.id }),
	});
}

export let Loaded_Developer_Modules = false;
export let Try_Loaded_Developer_Modules = false;

export let Monaco: typeof import("monaco-editor");
export let Monaco_Themes;
export let JSzip: typeof import("jszip");

export async function Load_Developer_Modules() {
	if (Try_Loaded_Developer_Modules || Loaded_Developer_Modules) {
		return;
	}

	Try_Loaded_Developer_Modules = true;

	const Loading_UI = await Create_Notification({
		Icon: "🔃",
		Title: "StyleShift - Loading Developer Modules",
		Content: "Loading...",
		Timeout: -1,
	});

	try {
		Loading_UI.Set_Content("Preparing : Jzip (Export theme as zip)");
		JSzip = (await import(chrome.runtime.getURL("modules/jszip.js"))).default.default;

		console.log("JSzip:", JSzip);

		if (!is_firefox || in_setting_page) {
			Loading_UI.Set_Content("Preparing : Monaco editor (Code editor)");

			const MonacoModule = await import(chrome.runtime.getURL("modules/monaco.js"));

			console.log(MonacoModule);

			Monaco = MonacoModule.Monaco;
			Monaco_Themes = MonacoModule.Monaco_Themes;

			for (const [Theme_Name, Theme_Content] of Object.entries(Monaco_Themes) as [string, any][]) {
				if (Theme_Name == "themelist") continue;
				Monaco.editor.defineTheme(Theme_Name.replace(/[^a-zA-Z0-9]|_|-/g, ""), Theme_Content);
			}

			Monaco.editor.setTheme("Dracula");

			Loading_UI.Set_Icon("✅");
			Loading_UI.Set_Title("StyleShift - Loaded Developer Modules");
			Loading_UI.Set_Content("");
		} else {
			Loading_UI.Set_Icon("⚠️");
			Loading_UI.Set_Title("StyleShift - Can't Monaco editor (Code editor)");
			Loading_UI.Set_Content(
				"If you want to use code editor, please consider enter setting page.\n(Firefox security issue!)"
			);
		}

		setTimeout(() => {
			Loading_UI.Close();
		}, 4000);

		Loaded_Developer_Modules = true;
	} catch (error) {
		console.log(error);
		Loading_UI.Close();
		(await Create_Error(error)).Set_Title("StyleShift - Error loading developer modules");
	}
}

//----------------------------------------------

export function Color_OBJ_to_HEX({ hex: HEX, alpha: Alpha }: color_obj): string {
	const alpha = Math.round((Alpha / 100) * 255)
		.toString(16)
		.padStart(2, "0");
	return `${HEX}${alpha}`;
}

export function HEX_to_Color_OBJ(hex: string): { HEX: string; Alpha: number } {
	if (typeof hex !== "string") {
		console.warn("HEX_to_Color_OBJ received non-string hex value:", hex);
		return { HEX: "#000000", Alpha: 100 };
	}
	const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;
	const rgbHex = cleanHex.length === 8 ? cleanHex.slice(0, 6) : cleanHex;
	const alphaHex = cleanHex.length === 8 ? cleanHex.slice(6) : "FF";

	return {
		HEX: `#${rgbHex}`,
		Alpha: Math.round((parseInt(alphaHex, 16) / 255) * 100),
	};
}
