import { Category } from "../../styleshift/types/store";
import { setup_auto_theater, setup_remove_ambient } from "../features/video/general";
import { setup_auto_pip, setup_auto_exit_pip } from "../features/video/pip";
import { setup_auto_show_chat_replay } from "../features/video/chat";
import { setup_update_timestamp } from "../features/video/timestamp";
import { setup_advanced_controls } from "../features/video/controls";
import { setup_flyout } from "../features/video/flyout";
import { setup_video_animations } from "../features/video/animations";

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
		{
			type: "checkbox",
			id: "AutoPIP",
			name: "Auto Picture In Picture mode",
			description:
				"Automatically enters Picture-in-Picture mode when you switch tabs or minimize the window.",
			value: true,
			enable_function: setup_auto_pip,
		},
		{
			type: "checkbox",
			id: "AutoEXPIP",
			name: "Auto exit Picture In Picture mode",
			description: "Automatically exits Picture-in-Picture mode when you return to the tab.",
			value: true,
			enable_function: setup_auto_exit_pip,
		},
		{
			type: "checkbox",
			id: "ChatReplay",
			name: "Auto show chat replay",
			description: "Automatically expands the chat replay on videos.",
			value: false,
			enable_function: setup_auto_show_chat_replay,
		},
		{
			type: "checkbox",
			id: "UpdateTimeStamp",
			name: "Update URL Timestamp",
			description:
				"Updates the URL with the current video timestamp every 10 seconds and on pause.",
			value: false,
			enable_function: setup_update_timestamp,
		},
		{
			type: "checkbox",
			id: "AdvancedControls",
			name: "Advanced Controls (Loop Button)",
			description: "Adds a Loop button to the video player controls.",
			value: true,
			enable_function: setup_advanced_controls,
		},
		{
			type: "checkbox",
			id: "Flyout",
			name: "Flyout (Sticky Player)",
			description:
				"Keeps the video player visible in the corner when scrolling down.",
			value: false,
			enable_function: setup_flyout,
			enable_css: `
      .newtube-flyout-mode {
        position: fixed !important;
        z-index: 2000 !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 400px !important;
        height: 225px !important; /* 16:9 aspect ratio of 400px */
        top: unset !important;
        left: unset !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 20px rgba(0,0,0,0.6) !important;
        overflow: hidden !important;
        transition: all 0.3s ease !important;
      }
      
      .newtube-flyout-mode .html5-video-container {
        width: 100% !important;
        height: 100% !important;
      }
      
      .newtube-flyout-mode video {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
      }

      /* Hide some controls in flyout mode to keep it clean */
      .newtube-flyout-mode .ytp-chrome-bottom {
        width: 100% !important;
        left: 0 !important;
      }
      
      .newtube-flyout-mode .ytp-size-button,
      .newtube-flyout-mode .ytp-fullscreen-button,
      .newtube-flyout-mode .ytp-settings-button,
      .newtube-flyout-mode .ytp-subtitles-button,
      .newtube-flyout-mode .ytp-miniplayer-button,
      .newtube-flyout-mode .ytp-remote-button,
      .newtube-flyout-mode .ytp-chapter-container {
        display: none !important;
      }
      `,
		},
		{
			type: "checkbox",
			id: "NewVDOanima",
			name: "New video animation (Volume, Play/Pause)",
			description: "Custom volume indicator and enhanced play/pause animations.",
			value: true,
			enable_function: setup_video_animations,
			enable_css: `
      .newtube-vol-indicator {
        position: absolute;
        top: 10%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 24px;
        font-weight: bold;
        opacity: 0;
        transition: opacity 0.3s, top 0.3s;
        pointer-events: none;
        z-index: 50;
        backdrop-filter: blur(5px);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
      }
      .newtube-vol-indicator.show {
        opacity: 1;
        top: 15%;
      }

      /* Youtube Bezel (Play/Pause/Seek arrows) Customization */
      .ytp-bezel-text-wrapper {
        display: none !important;
      }
      .ytp-bezel {
        background: rgba(0, 0, 0, 0.7) !important;
        border-radius: 50% !important;
        backdrop-filter: blur(4px);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
      }
      .ytp-bezel-icon {
        fill: white !important;
      }
      `,
		},
	],
};
