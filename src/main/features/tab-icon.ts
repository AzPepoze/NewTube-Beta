import { Load } from "../../styleshift/core/save";

let originalFavicon: string | null = null;

function changeFavicon(url: string) {
	let favicon = document.querySelector('link[rel*="icon"]') as HTMLLinkElement;
	if (favicon) {
		if (!originalFavicon) {
			originalFavicon = favicon.href;
		}
		favicon.href = url;
	} else {
		// If no icon exists, create one
		favicon = document.createElement("link");
		favicon.rel = "icon";
		favicon.href = url;
		document.head.appendChild(favicon);
	}
}

function revertFavicon() {
	if (originalFavicon) {
		const favicon = document.querySelector('link[rel*="icon"]') as HTMLLinkElement;
		if (favicon) {
			favicon.href = originalFavicon;
		}
	}
}

async function updateIcon() {
	const useCustomIcon = await Load("CustomIcon");
	if (!useCustomIcon) {
		revertFavicon();
		return;
	}
	const iconURL = (await Load("IconURL")) as string;
	if (iconURL) {
		changeFavicon(iconURL);
	}
}

export function setupTabIconChanger() {
	updateIcon();
	window.addEventListener("yt-navigate-finish", updateIcon);
}

export function disableTabIconChanger() {
	revertFavicon();
}
