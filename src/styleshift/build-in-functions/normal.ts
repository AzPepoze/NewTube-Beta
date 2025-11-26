/**
 * Pauses execution for a specified delay.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Promise<void>}
 * @example
 * await sleep(1000); // Pauses execution for 1 second
 */
export function sleep(delay: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, delay));
}

//---------------------------------------------

/**
 * Converts a hex color string to an RGBA object.
 * @param {string} hex - The hex color string.
 * @returns {{ r: number; g: number; b: number; a: number }}
 * @example
 * HEX_to_RBGA("#ff5733"); // { r: 255, g: 87, b: 51, a: 1 }
 */
export function HEX_to_RBGA(hex: string): { r: number; g: number; b: number; a: number } {
	hex = hex.replace(/^#/, "");

	if (hex.length === 6) {
		hex += "ff";
	} else if (hex.length !== 8) {
		throw new Error("Invalid hex color format");
	}

	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	const a = parseInt(hex.substring(6, 8), 16) / 255;

	return { r, g, b, a };
}

/**
 * Converts a hex color string to an RGB object.
 * @param {string} hex - The hex color string.
 * @returns {{ r: number; g: number; b: number }}
 * @example
 * HEX_to_RBG("#ff5733"); // { r: 255, g: 87, b: 51 }
 */
export function HEX_to_RBG(hex: string): { r: number; g: number; b: number } {
	hex = hex.replace(/^#/, "");

	if (hex.length === 3) {
		hex = hex
			.split("")
			.map(function (char) {
				return char + char;
			})
			.join("");
	}

	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);

	return { r, g, b };
}

/**
 * Converts RGBA values to a hex color string.
 * @param {number} r - The red value.
 * @param {number} g - The green value.
 * @param {number} b - The blue value.
 * @param {number} [a=1] - The alpha value.
 * @returns {string}
 * @example
 * RGBA_to_HEX(255, 87, 51, 0.5); // "#ff573380"
 */
export function RGBA_to_HEX(r: number, g: number, b: number, a: number = 1): string {
	r = Math.round(Math.min(255, Math.max(0, r)));
	g = Math.round(Math.min(255, Math.max(0, g)));
	b = Math.round(Math.min(255, Math.max(0, b)));
	a = Math.min(1, Math.max(0, a));

	let hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
		.toString(16)
		.padStart(2, "0")}`;
	if (a < 1) {
		hex += Math.round(a * 255)
			.toString(16)
			.padStart(2, "0");
	}

	return hex;
}

/**
 * Converts RGB values to an HSV object.
 * @param {{ r: number; g: number; b: number }} rgb - The RGB values.
 * @returns {{ h: number; s: number; v: number }}
 * @example
 * RGB_to_HSV({ r: 255, g: 87, b: 51 }); // { h: 14, s: 80, v: 100 }
 */
export function RGB_to_HSV(rgb: { r: number; g: number; b: number }): { h: number; s: number; v: number } {
	let r = rgb.r,
		g = rgb.g,
		b = rgb.b;
	r /= 255;
	g /= 255;
	b /= 255;
	const v = Math.max(r, g, b),
		c = v - Math.min(r, g, b);
	const h = c && (v === r ? (g - b) / c : v === g ? 2 + (b - r) / c : 4 + (r - g) / c);
	return {
		h: Math.round(60 * (h < 0 ? h + 6 : h)),
		s: v && Math.round((c / v) * 100),
		v: Math.round(v * 100),
	};
}

/**
 * Converts HSV values to an RGB object.
 * @param {{ h: number; s: number; v: number }} hsv - The HSV values.
 * @returns {{ r: number; g: number; b: number }}
 * @example
 * HSV_to_RGB({ h: 14, s: 80, v: 100 }); // { r: 255, g: 87, b: 51 }
 */
export function HSV_to_RGB(hsv: { h: number; s: number; v: number }): { r: number; g: number; b: number } {
	let h = hsv.h,
		s = hsv.s,
		v = hsv.v;
	s /= 100;
	v /= 100;
	const f = (n: number) => (v - v * s * Math.max(Math.min((n + h / 60) % 6, 4 - ((n + h / 60) % 6), 1), 0)) * 255;
	return { r: Math.round(f(5)), g: Math.round(f(3)), b: Math.round(f(1)) };
}

//---------------------------------------------

/**
 * Checks if an element is scrollable.
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean}
 * @example
 * is_scrollable(document.body); // true or false depending on the body scrollability
 */
export function is_scrollable(element: HTMLElement): boolean {
	const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
	const hasHorizontalScrollbar = element.scrollWidth > element.clientWidth;
	return hasVerticalScrollbar || hasHorizontalScrollbar;
}

/**
 * Gets the nearest scrollable parent of an element.
 * @param {HTMLElement | null} element - The element to check.
 * @returns {HTMLElement | null}
 * @example
 * Get_Scroll_Parent(document.querySelector("#myElement")); // Returns the nearest scrollable parent
 */
export function get_scroll_parent(element: HTMLElement | null): HTMLElement | null {
	if (!element) {
		return null;
	}

	let parent = element.parentNode;

	while (parent && parent !== document) {
		if (is_scrollable(parent as HTMLElement)) {
			return parent as HTMLElement;
		}
		parent = parent.parentNode;
	}

	return document.body;
}

/**
 * Converts a string to a number.
 * @param {string} str - The string to convert.
 * @returns {number}
 * @example
 * stringToNumber("example"); // Returns a numerical hash of the string
 */
export function stringToNumber(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0;
	}
	return Math.abs(hash);
}

/**
 * Generates a random number between a minimum and maximum value using a seed.
 * @param {number} Minimum - The minimum value.
 * @param {number} Maximum - The maximum value.
 * @param {string | number} Seed - The seed value.
 * @returns {number}
 * @example
 * Random(1, 100, "seed"); // Returns a random number between 1 and 100 based on the seed
 */
export function Random(Minimum: number, Maximum: number, Seed: string | number): number {
	const numericalSeed = typeof Seed === "string" ? stringToNumber(Seed) : Seed;

	const a = 931;
	const c = 49297;
	const m = 233280;

	let currentSeed = numericalSeed;

	const random = (): number => {
		currentSeed = (currentSeed * a + c) % m;
		return currentSeed / m;
	};

	return Math.floor(Minimum + random() * (Maximum - Minimum + 1));
}

/**
 * Gets the document body element, waiting if necessary.
 * @returns {Promise<HTMLElement>}
 * @example
 * await GetDocumentBody(); // Returns the document body element
 */
export async function GetDocumentBody(): Promise<HTMLElement> {
	const DocumentBody = document.body;

	if (DocumentBody) {
		return DocumentBody;
	} else {
		await sleep(100);
		return await GetDocumentBody();
	}
}

/**
 * Gets the document head element, waiting if necessary.
 * @returns {Promise<HTMLElement>}
 * @example
 * await GetDocumentHead(); // Returns the document head element
 */
export async function GetDocumentHead(): Promise<HTMLElement> {
	const DocumentHead = document.head;

	if (DocumentHead) {
		return DocumentHead;
	} else {
		await sleep(100);
		return await GetDocumentBody();
	}
}

/**
 * Executes a callback when a target element is removed from the DOM.
 * @param {HTMLElement} targetElement - The target element.
 * @param {Function} callback - The callback function.
 * @example
 * Once_Element_Remove(document.querySelector("#myElement"),() => console.log("Element removed"));
 */
export function Once_Element_Remove(targetElement: HTMLElement, callback: Function): void {
	const observer = new MutationObserver((mutationsList, observer) => {
		for (const mutation of mutationsList) {
			if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
				for (const removedNode of Array.from(mutation.removedNodes)) {
					if (removedNode === targetElement) {
						callback();
						observer.disconnect();
						return;
					}
				}
			}
		}
	});
	observer.observe(document.body, { childList: true });
}

/**
 * Gets the center position of an element.
 * @param {HTMLElement} element - The element to check.
 * @returns {{ x: number; y: number }}
 * @example
 * Get_Element_Center_Position(document.querySelector("#myElement")); // { x: number, y: number }
 */
export function Get_Element_Center_Position(element: HTMLElement): { x: number; y: number } {
	const rect = element.getBoundingClientRect();
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 2;

	return {
		x: centerX,
		y: centerY,
	};
}

/**
 * Waits for the document to be fully loaded.
 * @returns {Promise<number>}
 * @example
 * await Wait_Document_Loaded(); // Waits until the document is fully loaded
 */
export async function Wait_Document_Loaded(): Promise<number> {
	while (document.readyState !== "complete") {
		await sleep(10);
	}
	return 0;
}

/**
 * Creates a unique ID of a specified length.
 * @param {number} length - The length of the ID.
 * @returns {string}
 * @example
 * Create_UniqueID(10); // Returns a unique ID of length 10
 */
export function Create_UniqueID(length: number): string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let uniqueID = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		uniqueID += charset[randomIndex];
	}

	return uniqueID;
}

/**
 * Gets the current domain.
 * @returns {string}
 * @example
 * Get_Current_Domain(); // Returns the current domain
 */
export function Get_Current_Domain(): string {
	const hostname = window.location.origin;
	const domainParts = hostname.split(".");
	const domain = domainParts.slice(-2).join(".");

	return domain;
}

/**
 * Scrolls to a target element when a button is clicked.
 * @param {HTMLElement} Button - The button element.
 * @param {HTMLElement} Target - The target element.
 * @example
 * Scroll_On_Click(document.querySelector("#myButton"), document.querySelector("#myTarget"));
 */
export function Scroll_On_Click(Button: HTMLElement, Target: HTMLElement): void {
	Button.addEventListener("click", function () {
		Target.scrollIntoView({ behavior: "smooth" });
	});
}

/**
 * Applies drag functionality to an element.
 * @param {HTMLElement} Drag_Object - The draggable object.
 * @param {HTMLElement} Target - The target element.
 * @example
 * Apply_Drag(document.querySelector("#dragObject"), document.querySelector("#target"));
 */
export function Apply_Drag(Drag_Object: HTMLElement, Target: HTMLElement): void {
	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let initialTargetX = 0;
	let initialTargetY = 0;

	Drag_Object.addEventListener("mousedown", function (event) {
		isDragging = true;
		startX = event.clientX;
		startY = event.clientY;

		const rect = Target.getBoundingClientRect();
		initialTargetX = rect.left;
		initialTargetY = rect.top;

		event.preventDefault();
	});

	document.addEventListener("mousemove", function (event) {
		if (!isDragging) return;

		const deltaX = event.clientX - startX;
		const deltaY = event.clientY - startY;

		Target.style.left = `${initialTargetX + deltaX}px`;
		Target.style.top = `${initialTargetY + deltaY}px`;

		const Parent = Target.parentElement;
		Parent.style.justifyContent = "start";
		Parent.style.alignItems = "start";
	});

	document.addEventListener("mouseup", function () {
		if (!isDragging) return;
		isDragging = false;
	});
}

/**
 * Updates the drag position of an element.
 * @param {HTMLElement} Element - The element to update.
 * @param {MouseEvent} event - The mouse event.
 * @param {number} offsetX - The X offset.
 * @param {number} offsetY - The Y offset.
 * @example
 * Update_Drag_Position(document.querySelector("#element"), event, 10, 10);
 */
export function Update_Drag_Position(Element: HTMLElement, event: MouseEvent, offsetX: number, offsetY: number): void {
	Element.style.left = `${event.clientX - offsetX}px`;
	Element.style.top = `${event.clientY - offsetY}px`;
}

/**
 * Rearranges a selector string.
 * @param {string} value - The selector string.
 * @returns {string}
 * @example
 * ReArrange_Selector("div, span"); // "div,\nspan"
 */
export function ReArrange_Selector(value: string): string {
	return value.replace(/\s+/g, " ").replace(/\n/g, "").replace(/, /g, ",").replace(/,/g, ",\n");
}

/**
 * Checks if a value is an array of objects.
 * @param {any} value - The value to check.
 * @returns {boolean}
 * @example
 * isObjectArray([{ a: 1 }, { b: 2 }]); // true
 */
export function isObjectArray(value: any): boolean {
	return Array.isArray(value) && value.every((item) => typeof item === "object" && item !== null);
}

/**
 * Deep clones an object.
 * @param {any} data - The data to clone.
 * @returns {any}
 * @example
 * deepClone({ a: 1 }); // { a: 1 }
 */
export function deepClone(data: any): any {
	return JSON.parse(JSON.stringify(data));
}

/**
 * Checks if two objects are the same.
 * @param {object} obj1 - The first object.
 * @param {object} obj2 - The second object.
 * @returns {boolean}
 * @example
 * Is_Same_OBJ({ a: 1 }, { a: 1 }); // true
 */
export function Is_Same_OBJ(obj1: object, obj2: object): boolean {
	if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
	for (const key in obj1) {
		if (obj1[key] !== obj2[key]) return false;
	}
	return true;
}

/**
 * Waits for an element to appear in the DOM.
 * @param {string} selector - The CSS selector.
 * @param {number} [timeout] - The timeout in milliseconds.
 * @returns {Promise<HTMLElement | null>}
 * @example
 * await WaitForElement("#myElement", 5000); // Waits for the element to appear within 5 seconds
 */
export async function WaitForElement(selector: string, timeout?: number): Promise<HTMLElement | null> {
	const startTime = Date.now();
	while (true) {
		const element = document.querySelector(selector) as HTMLElement | null;
		if (element) {
			return element;
		}
		if (timeout && Date.now() - startTime >= timeout) {
			console.warn(`Timeout: Element "${selector}" not found within ${timeout}ms`);
			return null;
		}
		await sleep(100);
	}
}

/**
 * Downloads a file with the specified data and filename.
 * @param {BlobPart} data - The file data.
 * @param {string} filename - The filename.
 * @example
 * Download_File("Hello, world!", "hello.txt");
 */
export function Download_File(data: BlobPart, filename: string): void {
	const file = new Blob([data]);
	const a = document.createElement("a"),
		url = URL.createObjectURL(file);
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	setTimeout(function () {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}

/**
 * Handles file input change event.
 * @param {HTMLInputElement} Element - The input element.
 * @example
 * Input_File(document.querySelector("#fileInput"));
 */
export function Input_File(Element: HTMLInputElement): void {
	Element.addEventListener("change", async (event: Event) => {
		const file = (event.target as HTMLInputElement).files[0];
		if (!file) return;

		try {
			return file;
		} catch (error) {
			console.error("Error reading file:", error);
		}
	});
}

/**
 * Gets the current URL parameters.
 * @returns {{ [key: string]: string }}
 * @example
 * Get_Current_URL_Parameters(); // Returns an object with the current URL parameters
 */
export function Get_Current_URL_Parameters(): { [key: string]: string } {
	const searchParams = new URL(window.location.href).searchParams;
	const result: { [key: string]: string } = {};
	searchParams.forEach((value, key) => {
		result[key] = value;
	});
	return result;
}

//---------------------------------------------

/**
 * Fires a custom event with the specified function name and arguments.
 * @param {string} [Prefix="Function"] - The event prefix.
 * @param {string} Function_Name - The function name.
 * @param {...any[]} args - The function arguments.
 * @returns {Promise<void>}
 * @example
 * await Fire_Function_Event("Custom", "MyFunction", 1, 2, 3);
 */
export async function Fire_Function_Event(
	Prefix: string = "Function",
	Function_Name: string,
	...args: any[]
): Promise<void> {
	const Sent_Event = new CustomEvent(`${Prefix}_${Function_Name}`, {
		detail: { data: args },
	});
	console.log("Sent", Sent_Event);
	window.dispatchEvent(Sent_Event);
}

/**
 * Fires a custom event with the specified function name and arguments, and waits for a return value.
 * @param {string} [Prefix="Function"] - The event prefix.
 * @param {string} Function_Name - The function name.
 * @param {...any[]} args - The function arguments.
 * @returns {Promise<any>}
 * @example
 * const result = await Fire_Function_Event_With_Return("Custom", "MyFunction", 1, 2, 3);
 */
export async function Fire_Function_Event_With_Return(
	Prefix: string = "Function",
	Function_Name: string,
	...args: any[]
): Promise<any> {
	const remote_id = Create_UniqueID(10);

	const Sent_Event = new CustomEvent(`${Prefix}_${Function_Name}`, {
		detail: JSON.stringify({ remote_id: remote_id, data: args }),
	});

	console.log("Sent", Sent_Event);

	window.dispatchEvent(Sent_Event);

	return new Promise((resolve, reject) => {
		window.addEventListener(
			`${Prefix}_${Function_Name}_${remote_id}`,
			function (event) {
				//@ts-ignore
				const Detail = JSON.parse(event.detail);
				console.log("Return Data", `${Prefix}_${Function_Name}_${remote_id}`, Detail);
				resolve(Detail);
			},
			{ once: true }
		);
	});
}

/**
 * Listens for a custom event with the specified function name and executes a callback.
 * @param {string} [Prefix="Function"] - The event prefix.
 * @param {string} Function_Name - The function name.
 * @param {Function} callback - The callback function.
 * @returns {Promise<{ Cancel: Function }>}
 * @example
 * const listener = await On_Function_Event("Custom", "MyFunction", (data) => console.log(data));
 * listener.Cancel(); // Cancels the event listener
 */
export async function On_Function_Event(
	Prefix: string = "Function",
	Function_Name: string,
	callback: Function
): Promise<{ Cancel: Function }> {
	const On_Event_Run_Function = async function (event: Event) {
		const Detail = JSON.parse((event as CustomEvent).detail);
		console.log("Recived", event);

		//@ts-ignore
		const remote_id = Detail.remote_id;
		//@ts-ignore
		// delete event.detail.remote_id;
		//@ts-ignore
		let Get_Return;

		if (
			//@ts-ignore
			Detail.data &&
			//@ts-ignore
			Object.keys(Detail.data).length > 0
		) {
			//@ts-ignore
			Get_Return = await callback(...Detail.data);
		} else {
			Get_Return = await callback();
		}
		window.dispatchEvent(
			new CustomEvent(`${Prefix}_${Function_Name}_${remote_id}`, {
				detail: JSON.stringify(Get_Return),
			})
		);
	};

	window.addEventListener(`${Prefix}_${Function_Name}`, On_Event_Run_Function);

	return {
		Cancel: function () {
			window.removeEventListener(`${Prefix}_${Function_Name}`, On_Event_Run_Function);
		},
	};
}

/**
 * Waits for one animation frame.
 * @returns {Promise<boolean>}
 * @example
 * await Wait_One_Frame(); // Waits for one animation frame
 */
export function wait_one_frame(): Promise<boolean> {
	return new Promise((resolve) => {
		requestAnimationFrame(() => {
			resolve(true);
		});
	});
}

/**
 * Inserts a new node after an existing node.
 * @param {Node} newNode - The new node.
 * @param {Node} existingNode - The existing node.
 * @example
 * insertAfter(document.createElement("div"), document.querySelector("#existingNode"));
 */
export function insert_after(newNode: Node, existingNode: Node, parentNode?: Node): void {
	(existingNode.parentNode || parentNode).insertBefore(newNode, existingNode.nextSibling);
}

/**
 * Formats a number with commas as thousands separators.
 * @param {number} x - The number to format.
 * @returns {string} The formatted number with commas.
 * @example
 * numberWithCommas(1000); // "1,000"
 */
export function number_with_commas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
