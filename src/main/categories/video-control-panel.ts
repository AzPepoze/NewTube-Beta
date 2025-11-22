import { Category } from "../../styleshift/types/store";

export const VideoControlPanelCategory: Category = {
	Category: "🎚️ Video control panel",
	Settings: [
		{
			type: "Color",
			id: "Time-LineBG",
			name: "Timeline Background",
			description: "Color of the timeline background.",
			value: "#ffffff20",
			var_css: "--timeline-bg-color",
			constant_css: `
      .ytp-progress-bar {
        background-color: var(--timeline-bg-color, #ffffff20) !important;
      }
    `,
		},
		{
			type: "Color",
			id: "TimeLoaded",
			name: "Timeline Loaded Color",
			description: "Color of the loaded progress on the timeline.",
			value: "#ffffff50",
			var_css: "--timeline-load-color",
			constant_css: `
      .ytp-load-progress {
        background: var(--timeline-load-color, #ffffff50) !important;
      }
    `,
		},
		{
			type: "Color",
			id: "VDOTEXT",
			name: "Control Panel Text",
			description: "Color of the text on the video control panel (time, etc.).",
			value: "#ffffffff",
			var_css: "--control-text-color",
			constant_css: `
      .ytp-time-display, .ytp-button {
        color: var(--control-text-color) !important;
      }
    `,
		},
		{
			type: "Color",
			id: "HBT",
			name: "Control Panel Hover Button",
			description: "Background color when hovering over buttons on the control panel.",
			value: "#ffffff20",
			var_css: "--control-hover-bg-color",
			constant_css: `
      .ytp-button:hover {
        background-color: var(--control-hover-bg-color) !important;
      }
    `,
		},
		{
			type: "Checkbox",
			id: "ControlUnderVDO",
			name: "Move Controls Below Video",
			description: "Moves the video control panel to appear underneath the video player.",
			value: true,
			enable_css: `
      #player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode) {
        padding-bottom: var(--media-space, 70px);
      }
      div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode) .ytp-chrome-bottom {
        overflow: visible !important;
        padding-top: 0px !important;
      }
      #player-wide-container div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed) > .ytp-chrome-bottom {
        transform: translate(0px, var(--media-space, 70px));
      }
      #player:has(div.html5-video-player:not(.ytp-fullscreen):not(.ytp-small-mode):not(.ytp-embed)) {
        margin-bottom: var(--media-space, 70px);
      }
    `,
		},
		{
			type: "Number_Slide",
			id: "MediaSpace",
			name: "Controls-Below-Video Distance",
			description: "Adjusts the distance of the control panel when moved below the video.",
			value: 70,
			min: 30,
			max: 200,
			step: 1,
			var_css: "--media-space",
		},
		{
			type: "Checkbox",
			id: "CenterMedia",
			name: "Center Control Buttons",
			description: "Centers the buttons on the video control panel.",
			value: true,
			enable_css: `
      .ytp-chrome-controls {
        display: flex !important;
        flex-direction: row !important;
        justify-content: center !important;
      }
      .ytp-left-controls, .ytp-chapter-title.ytp-button, .ytp-chapter-container {
        display: contents !important;
      }
    `,
		},
		{
			type: "Color",
			id: "MediaBG",
			name: "Control Panel Background",
			description: "Background color of the video control panel.",
			value: "#00000080",
			var_css: "--media-bg-color",
			constant_css: `
      .ytp-chrome-bottom {
        background-color: var(--media-bg-color) !important;
      }
    `,
		},
		{
			type: "Checkbox",
			id: "MediaBlur",
			name: "Blur Control Panel Background",
			description: "Applies a blur effect to the control panel background.",
			value: true,
			enable_css: `
      .ytp-chrome-bottom {
        backdrop-filter: blur(var(--media-blur-amount, 10px)) !important;
      }
    `,
		},
		{
			type: "Number_Slide",
			id: "MediaBlurAmount",
			name: "Control Panel Blur Amount",
			description: "Adjusts the amount of blur on the control panel.",
			value: 10,
			min: 0,
			max: 50,
			step: 1,
			var_css: "--media-blur-amount",
		},
	],
};
