import { Category } from "../../styleshift/types/store";

export const FontsCategory: Category = {
	category: "🔠 Fonts",
	settings: [
		{
			type: "Custom",
			id: "FontManager",
			ui_function: async function (frame: HTMLElement) {
				frame.innerHTML = ""; // Clear previous UI
				frame.style.display = "flex";
				frame.style.flexDirection = "column";
				frame.style.gap = "10px";

				const fontNameLabel = document.createElement("label");
				fontNameLabel.textContent = 'Font Name (e.g., "Roboto"):';
				const fontNameInput = document.createElement("input");
				fontNameInput.className = "STYLESHIFT-Text_Input";
				fontNameInput.placeholder = "Roboto";

				const fontUrlLabel = document.createElement("label");
				fontUrlLabel.textContent = "Font URL (e.g., from Google Fonts):";
				const fontUrlInput = document.createElement("input");
				fontUrlInput.className = "STYLESHIFT-Text_Input";
				fontUrlInput.placeholder = "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2";

				const applyButton = document.createElement("div");
				applyButton.className = "STYLESHIFT-Button";
				applyButton.textContent = "Apply Font";
				applyButton.style.textAlign = "center";

				frame.append(fontNameLabel, fontNameInput, fontUrlLabel, fontUrlInput, applyButton);

				applyButton.addEventListener("click", () => {
					const fontName = fontNameInput.value;
					const fontUrl = fontUrlInput.value;

					if (!fontName || !fontUrl) {
						alert("Please provide both a font name and a URL.");
						return;
					}

					const styleId = "styleshift-custom-font-style";
					let styleTag = document.getElementById(styleId) as HTMLStyleElement;
					if (!styleTag) {
						styleTag = document.createElement("style");
						styleTag.id = styleId;
						document.head.appendChild(styleTag);
					}

					styleTag.innerHTML = `
                        @font-face {
                            font-family: '${fontName}';
                            src: url('${fontUrl}');
                        }
                        body, #masthead, .ytd-app, button, input, textarea, select {
                            font-family: '${fontName}', Roboto, Arial, sans-serif !important;
                        }
                    `;
					alert("Font applied!");
				});
			},
		},
	],
};
