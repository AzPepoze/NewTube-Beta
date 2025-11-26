import { Create_UniqueID, Once_Element_Remove, Wait_Document_Loaded } from "../build-in-functions/normal";
import { Get_StyleShift_Items } from "../settings/items";
import { Create_Editor_UI, Editor_UI } from "./editor";
import { Show_Confirm } from "./extension";

let Highlight_Elements = {};
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY = 150;

function debounce(callback: Function) {
	if (debounceTimer) {
		clearTimeout(debounceTimer);
	}
	debounceTimer = setTimeout(() => {
		callback();
		debounceTimer = null;
	}, DEBOUNCE_DELAY);
}

function Add_Highlight(targetElement: HTMLElement, Selector_Value) {
	console.log(Highlight_Elements);

	const Exist_UniqueID = targetElement.getAttribute("StyleShift-UniqueID");
	if (Exist_UniqueID) {
		const OBJ = Highlight_Elements[Exist_UniqueID];
		console.log(OBJ.targetElement, targetElement);
		OBJ.Stop();
	}

	const UniqueID = Create_UniqueID(10);

	targetElement.setAttribute("StyleShift-UniqueID", UniqueID);

	const Color = `rgba(${Selector_Value.Highlight_Color}`;

	const highlighter = document.createElement("div");
	highlighter.className = "STYLESHIFT-Highlight";
	highlighter.setAttribute("Selector", Selector_Value.Selector);

	highlighter.style.background = `${Color},0.3)`;
	highlighter.style.borderColor = `${Color},0.8)`;

	const ComputedStyle = window.getComputedStyle(targetElement, null);

	highlighter.style.width = `calc(100% - 
	${ComputedStyle.getPropertyValue("padding-left")} - 
	${ComputedStyle.getPropertyValue("padding-right")} - 2px
	)`;
	highlighter.style.height = `calc(100% - 
	${ComputedStyle.getPropertyValue("padding-top")} - 
	${ComputedStyle.getPropertyValue("padding-bottom")} - 2px
	)`;

	targetElement.append(highlighter);

	highlighter.onclick = function () {
		Create_Editor_UI(targetElement, Selector_Value);
		Stop_Highlighter();
	};

	const old_style = targetElement.style.position;
	targetElement.style.position = "relative";

	function Stop() {
		if (targetElement) {
			targetElement.style.position = old_style;
		}
		highlighter.remove();
		targetElement.removeAttribute("StyleShift-UniqueID");
		delete Highlight_Elements[UniqueID];
	}

	Once_Element_Remove(targetElement, function () {
		Stop();
	});

	const return_OBJ = {
		highlighter: highlighter,
		targetElement: targetElement,
		Stop: Stop,
	};

	Highlight_Elements[UniqueID] = return_OBJ;

	return return_OBJ;
}

let Watch_Body: MutationObserver;

export async function Start_Highlighter() {
	await Wait_Document_Loaded();
	const Editable_Items = await Get_StyleShift_Items();
	console.log("Editable_Items", Editable_Items);
	const Exept_Items = [];

	const containers = document.querySelectorAll(".dynamic-content, .user-content, main, #content");

	Watch_Body = new MutationObserver((mutationsList) => {
		debounce(async () => {
			for (const mutation of mutationsList) {
				if (mutation.type === "childList") {
					for (const node of mutation.addedNodes as any) {
						if (node.nodeType === Node.ELEMENT_NODE) {
							for (const Selector_Value of [...Editable_Items.Default, ...Editable_Items.Custom]) {
								if (
									Selector_Value.selector != "" &&
									node.matches(Selector_Value.selector) &&
									!Exept_Items.some((item) => item === Selector_Value.selector)
								) {
									console.log("Add New Node", Selector_Value.selector);
									Add_Highlight(node, Selector_Value);
									break;
								}
							}
						}
					}
				}
			}
		});
	});

	if (containers.length > 0) {
		containers.forEach((container) => {
			Watch_Body.observe(container, {
				childList: true,
				subtree: true,
				attributeFilter: ["class", "id"],
			});
		});
	} else {
		Watch_Body.observe(document.body, {
			childList: true,
			subtree: true,
			attributeFilter: ["class", "id"],
		});
	}

	for (const Selector_Value of [...Editable_Items.Default, ...Editable_Items.Custom]) {
		if (Selector_Value.selector == "") continue;

		const Selector_Found = document.querySelectorAll(Selector_Value.selector);

		if (
			Selector_Found.length >= 1000 &&
			!(await Show_Confirm(
				`StyleShift : I found ${Selector_Found.length} elements on selector "${Selector_Value.selector}"\n\nAre you wish to continue??`
			))
		) {
			Exept_Items.push(Selector_Value.selector);
			continue;
		}

		console.log("Selector_Found", Selector_Value.selector, Selector_Found);

		// Process elements in chunks to avoid blocking the main thread
		const CHUNK_SIZE = 50;
		for (let i = 0; i < Selector_Found.length; i += CHUNK_SIZE) {
			const chunk = Array.from(Selector_Found).slice(i, i + CHUNK_SIZE);
			setTimeout(() => {
				chunk.forEach((element) => {
					Add_Highlight(element as HTMLElement, Selector_Value);
				});
			}, 0);
		}
	}
}

function Stop_Highlighter() {
	if (Watch_Body) {
		Watch_Body.disconnect();
	}

	for (const Highlight_Elements_OBJ of Object.values(Highlight_Elements) as any) {
		Highlight_Elements_OBJ.Stop();
	}

	Highlight_Elements = [];
}

let Running_Cusomize = false;

export async function Start_Customize() {
	if (Running_Cusomize) {
		return;
	}
	Running_Cusomize = true;
	Start_Highlighter();
}

export function Stop_Customize() {
	if (!Running_Cusomize) {
		return;
	}
	Running_Cusomize = false;
	Stop_Highlighter();
}

export async function Toggle_Customize() {
	if (Running_Cusomize) {
		Stop_Customize();
		Editor_UI.Remove_UI(false);
	} else {
		Start_Customize();
	}
}
