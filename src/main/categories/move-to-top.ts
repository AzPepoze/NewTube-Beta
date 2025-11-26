import { Category } from "../../styleshift/types/store";
import { create_move_to_top_button, destroy_move_to_top_button, update_move_to_top_icon } from "../features/move-to-top";

export const move_to_top_category: Category = {
	category: "⏫ Move To Top",
	settings: [
		{
			type: "checkbox",
			id: "MoveToTop",
			name: "Enable Move to Top button",
			description: "shows a button to quickly scroll back to the top of the page.",
			value: true,
			enable_function: create_move_to_top_button,
			disable_function: destroy_move_to_top_button,
		},
		{
			type: "text_input",
			id: "MoveToTop_URL",
			name: "button image URL",
			description: "URL for the custom image for the Move to Top button.",
			value: "https://i.ibb.co/0Mr31QR/Preview.png", // Default icon from NewTube
			update_function: update_move_to_top_icon,
		},
	],
};
