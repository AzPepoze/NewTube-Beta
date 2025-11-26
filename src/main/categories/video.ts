import { Category } from "../../styleshift/types/store";
import { setup_AutoTheater, setup_RemoveAmbient } from "../features/video";

export const VideoCategory: Category = {
	category: "📺 Video",
	settings: [
		{
			type: "Number_Slide",
			id: "PlayerEdge",
			name: "Player Round Edges",
			description: "Controls the roundness of the video player's corners.",
			value: 20,
			min: 0,
			max: 60,
			step: 1,
			var_css: "--player-edge-radius",
			constant_css: `
      .html5-video-player {
        border-radius: var(--player-edge-radius, 20px) !important;
      }
    `,
		},
		{
			type: "Checkbox",
			id: "VdoAnim",
			name: "Video Transition",
			description: "Enable transition animation when the video starts.",
			value: true,
			enable_css: `
      div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed) .html5-video-container {
        transition: all 1s, background 0.1s;
      }
      div.ended-mode .html5-video-container,
      div.unstarted-mode:not(.ytp-small-mode) .html5-video-container {
        transform: scale(0.5);
        opacity: 0 !important;
      }
    `,
		},

		{
			type: "Color",
			id: "EndBG",
			name: "End-of-Video Hover Color",
			description: "Background color when hovering over suggested videos at the end.",
			value: "#00000050",
			var_css: "--end-bg-hover-color",
			constant_css: `
      .ytp-videowall-still:hover .ytp-videowall-still-info-content {
        background: var(--end-bg-hover-color, #00000050) !important;
      }
    `,
		},
		{
			type: "Checkbox",
			id: "CenterUD",
			name: "Center Title (Under Video)",
			description: "Moves the video title to the center when in normal view.",
			value: true,
			enable_css: `
      #title.ytd-watch-metadata, #container.ytd-video-primary-info-renderer {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-block: 30px;
      }
      ytd-watch-metadata.ytd-watch-flexy {
        display: flex;
        flex-direction: column;
      }
      h1.ytd-watch-metadata {
        text-align: center;
      }
    `,
		},
		{
			type: "Checkbox",
			id: "CenterUDF",
			name: "Center Title (Fullscreen)",
			description: "Moves the video title to the center when in fullscreen/theater mode.",
			value: true,
			enable_css: `
      .ytp-big-mode .ytp-title-text {
        text-align: center;
      }
    `,
		},
		{
			type: "Checkbox",
			id: "AutoTheater",
			name: "Auto Theater Mode",
			description:
				"Automatically enters theater mode when you open a video. (May require a page reload to take effect)",
			value: false,
			enable_function: setup_AutoTheater,
		},
		{
			type: "Checkbox",
			id: "FullTheater",
			name: "Full Bleed Theater Mode",
			description: "Makes the video player take up the full height of the screen in theater mode.",
			value: false,
			enable_css: `
      ytd-watch-flexy[theater] #full-bleed-container.ytd-watch-flexy {
        height: calc(100vh - 56px) !important;
        max-height: unset !important;
      }
    `,
		},
		{
			type: "Number_Slide",
			id: "BelowSpace",
			name: "Space Below Video",
			description: "Adds extra space below the video player.",
			value: 0,
			min: 0,
			max: 200,
			step: 5,
			var_css: "--below-video-space",
			constant_css: `
      #player-container.ytd-watch-flexy {
        margin-bottom: var(--below-video-space, 0px);
      }
    `,
		},
		{
			type: "Checkbox",
			id: "RemoveAmbient",
			name: "Remove YouTube's Ambient Mode",
			description: "Automatically turns off YouTube's built-in ambient mode feature.",
			value: true,
			enable_function: setup_RemoveAmbient,
		},
	],
};
