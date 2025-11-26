import { Category } from "../../styleshift/types/store";
import { createMoveToTopButton, destroyMoveToTopButton, updateMoveToTopIcon } from "../features/move-to-top";

export const MoveToTopCategory: Category = {
	category: "⏫ Move To Top",
	settings: [
		{
			type: "Checkbox",
			id: "MoveToTop",
			name: "Enable Move to Top Button",
			description: "Shows a button to quickly scroll back to the top of the page.",
			value: true,
			enable_function: createMoveToTopButton,
			disable_function: destroyMoveToTopButton,
		},
		{
			type: "Text_Input",
			id: "MoveToTop_URL",
			name: "Button Image URL",
			description: "URL for the custom image for the Move to Top button.",
			value: "https://i.ibb.co/0Mr31QR/Preview.png", // Default icon from NewTube
			update_function: updateMoveToTopIcon,
		},
	],
};
