import { WaitForElement } from "../../styleshift/build-in-functions/normal";

export let ytd_app: HTMLElement | null = null;

export async function get_ytd_app() {
	if (!ytd_app) {
		ytd_app = await WaitForElement("ytd-app");
	}

	return ytd_app;
}
