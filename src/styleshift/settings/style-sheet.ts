import { GetDocumentHead, sleep } from "../build-in-functions/normal";
import { Load_Setting } from "../core/save";

let StyleSheet_Holder: HTMLElement;
let StyleSheet_Holder_Constant: HTMLElement;

export async function Create_StyleSheet_Holder() {
	StyleSheet_Holder = document.createElement("fieldset");
	StyleSheet_Holder.id = "STYLESHIFT_StyleSheet_Holder";

	if ((await Load_Setting("Enable_Extension")) == true) {
		Show_StyleSheet();
	} else {
		Hide_StyleSheet();
	}

	StyleSheet_Holder_Constant = document.createElement("fieldset");
	StyleSheet_Holder_Constant.id = "STYLESHIFT_StyleSheet_Holder_Constant";
	setTimeout(async () => {
		(await GetDocumentHead()).append(StyleSheet_Holder_Constant);
	}, 1);
}

export function Create_StyleSheet(id: string, constant: boolean = false) {
	let StyleSheet = document.createElement("style");
	StyleSheet.setAttribute("STYLESHIFT_StyleSheet_id", id);

	if (constant) {
		StyleSheet_Holder_Constant.append(StyleSheet);
	} else {
		StyleSheet_Holder.append(StyleSheet);
	}

	return StyleSheet;
}

export async function Show_StyleSheet() {
	setTimeout(async () => {
		(await GetDocumentHead()).append(StyleSheet_Holder);
	}, 1);
}

export async function Hide_StyleSheet() {
	if (StyleSheet_Holder) {
		StyleSheet_Holder.remove();
	} else {
		await sleep(10);
		await Hide_StyleSheet();
	}
}
