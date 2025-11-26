import { Category } from "../../styleshift/types/store";
import { enable_new_youtube_layout, disable_new_youtube_layout } from "../features/beta";

export const beta_features_category: Category = {
	category: "🌠 Beta features!",
	settings: [
		{
			type: "text",
			html: "Warning: These features are experimental and may not work as expected. A page reload is often required.",
		},
		{
			type: "checkbox",
			id: "NewYoutubeLayout",
			name: "Force Enable New YouTube Layout",
			description: "Tries to force YouTube to use its newer, experimental ui layout. Requires a page reload.",
			value: false,
			enable_function: enable_new_youtube_layout,
			disable_function: disable_new_youtube_layout,
		},
		{
			type: "checkbox",
			id: "Theme_by_video",
			name: "Theme By Video (ui Only)",
			description:
				"ui placeholder. Changes theme colors based on the video thumbnail. (Functionality not implemented)",
			value: false,
		},
		{
			type: "checkbox",
			id: "Visualizer",
			name: "Audio Visualizer (ui Only)",
			description: "ui placeholder. shows an audio visualizer on the video. (Functionality not implemented)",
			value: false,
		},
		{
			type: "checkbox",
			id: "NewVDOanima",
			name: "New Video Animations (ui Only)",
			description:
				"ui placeholder. Adds new animations for play, pause, volume changes, etc. (Functionality not implemented)",
			value: false,
		},
	],
};
