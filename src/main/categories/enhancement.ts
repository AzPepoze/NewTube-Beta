import { Category } from "../../styleshift/types/store";
import { setupFlyoutListener, setupChatReplay } from "../features/enhancement";

export const EnhancementCategory: Category = {
	category: "🎇 Enhancement",
	settings: [
		{
			type: "Number_Slide",
			id: "Edge",
			name: "Round edges amount (Most UI)",
			description: "Adjusts the corner roundness for most UI elements like buttons and menus.",
			value: 10,
			min: 0,
			max: 30,
			step: 1,
			var_css: "--global-radius",
			constant_css: `
                .yt-spec-button-shape-next, .ytp-popup, .ytp-settings-menu, ytd-menu-popup-renderer, #chips, ytd-guide-entry-renderer {
                    border-radius: var(--global-radius, 10px) !important;
                }
            `,
		},
		{
			type: "Checkbox",
			id: "SwapRow",
			name: "Swap left-right row (In watching mode)",
			description: "Swaps the main video column with the secondary recommendations column.",
			value: false,
			enable_css: `
                #columns.ytd-watch-flexy {
                    flex-direction: row-reverse !important;
                }
            `,
		},
		{
			type: "Checkbox",
			id: "ScrollRow",
			name: "Srollable row",
			description: "(In normal watching mode only)\nFlyout will not working",
			value: true,
			enable_css: `
                html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)):has(#engagement-panel-scrim[hidden]) #secondary,
                html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)):has(#engagement-panel-scrim[hidden]) #primary {
                    height: 92vh;
                    overflow-y: scroll;
                    overflow-x: visible;
                }
                html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)):has(#engagement-panel-scrim[hidden]) ytd-app,
                html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)):has(#engagement-panel-scrim[hidden]) #content.ytd-app {
                    height: 100vh;
                    overflow: hidden;
                }
            `,
		},
		{
			type: "Checkbox",
			id: "SrollRowFade",
			name: "Srollable row Top-Bottom Fade",
			description: "(Medium impact)",
			value: true,
			enable_css: `
                :root {
                    --scroll-row-mask: linear-gradient(to bottom, transparent, black 20px, black 95%, transparent);
                }
                html:has(#player div.html5-video-player:not(.ytp-fullscreen):not(.ytp-embed):not(.ytp-small-mode):not(.unstarted-mode)):has(#engagement-panel-scrim[hidden]) #secondary {
                    -webkit-mask-image: var(--scroll-row-mask);
                }
            `,
		},
		{
			type: "Checkbox",
			id: "Flyout",
			name: "Enable Flyout Video (Show video after scroll down)",
			description: "Makes the video player stick to the corner of the screen when you scroll down.",
			value: true,
			enable_function: setupFlyoutListener,
			enable_css: `
                #player.flyout-active {
                    position: fixed !important;
                    z-index: 1000;
                    bottom: 20px !important;
                    right: 20px !important;
                    width: 400px !important;
                    height: auto !important;
                    top: unset !important;
                    left: unset !important;
                }
            `,
		},
		{
			type: "Checkbox",
			id: "ChatReplay",
			name: "Auto show chat replay",
			description: "Automatically opens the chat replay on videos that have one.",
			value: false,
			enable_function: setupChatReplay,
		},
	],
};
