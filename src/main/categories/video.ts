import { Category } from "../../styleshift/types/store";
import { setup_auto_theater, setup_remove_ambient } from "../features/video";

export const video_category: Category = {
	category: "📺 Video",
	selector: "#ytd-player",
	settings: [
		{
			type: "number_slide",
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
			type: "checkbox",
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
			type: "color",
			id: "EndBG",
			name: "End-of-Video hover color",
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
			type: "checkbox",
			id: "CenterUD",
			name: "Center title (Under Video)",
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
			type: "checkbox",
			id: "CenterUDF",
			name: "Center title (Fullscreen)",
			description: "Moves the video title to the center when in fullscreen/theater mode.",
			value: true,
			enable_css: `
      .ytp-big-mode .ytp-title-text {
        text-align: center;
      }
    `,
		},
		{
			type: "checkbox",
			id: "AutoTheater",
			name: "Auto Theater mode",
			description:
				"Automatically enters theater mode when you open a video. (May require a page reload to take effect)",
			value: false,
			enable_function: setup_auto_theater,
		},
		{
			type: "checkbox",
			id: "FullTheater",
			name: "Full Bleed Theater mode",
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
			type: "number_slide",
			id: "Belowspace",
			name: "space Below Video",
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
			type: "checkbox",
			id: "RemoveAmbient",
			name: "Remove YouTube's Ambient mode",
			description: "Automatically turns off YouTube's built-in ambient mode feature.",
			value: true,
			enable_function: setup_remove_ambient,
		},
	],
};
