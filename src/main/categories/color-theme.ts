import { Category } from "../../styleshift/types/store";

export const ColorThemeCategory: Category = {
    Category: "🌈 Color/Theme",
    Settings: [
        {
            type: "Color",
            id: "Theme",
            name: "Main Theme Color",
            description: "The primary accent color used throughout the UI.",
            value: "#659affff",
            var_css: "--theme-color",
        },
        {
            type: "Color",
            id: "ThemeThr",
            name: "Transparent Theme Color",
            description: "A transparent version of the theme color, used for backgrounds and highlights.",
            value: "#659aff33",
            var_css: "--theme-transparent-color",
        },
        {
            type: "Color",
            id: "LeftBar",
            name: "Left Sidebar Background",
            description: "Background color of the main left-hand sidebar.",
            value: "#00000000",
            var_css: "--left-sidebar-bg",
            constant_css: `
                #guide-inner-content.ytd-app, ytd-mini-guide-renderer {
                    background: var(--left-sidebar-bg) !important;
                }
            `
        },
        {
            type: "Color",
            id: "Text",
            name: "Main Text Color",
            description: "The primary text color for general UI text.",
            value: "#ffffffff",
            var_css: "--main-text-color",
            constant_css: `
                ytd-watch-flexy, #video-title, #channel-name, .ytd-video-primary-info-renderer, .ytd-video-secondary-info-renderer {
                    color: var(--main-text-color) !important;
                }
            `
        },
        {
            type: "Color",
            id: "NdText",
            name: "Secondary Text Color",
            description: "The secondary text color, used for metadata, descriptions, and less important text.",
            value: "#c4c4c4ff",
            var_css: "--secondary-text-color",
            constant_css: `
                #metadata-line, .ytd-video-meta-block, #description-text, .ytd-comment-renderer, .yt-formatted-string[is-empty] {
                    color: var(--secondary-text-color) !important;
                }
            `
        },
        {
            type: "Color",
            id: "LinkColor",
            name: "Link Color",
            description: "The color for hyperlinks in descriptions and comments.",
            value: "#5797ffff",
            var_css: "--link-color",
            constant_css: `
                .yt-core-attributed-string__link {
                    color: var(--link-color) !important;
                }
            `
        },
        {
            type: "Color",
            id: "TIMETEXT",
            name: "Timestamp Text Color",
            description: "The color of the text for video timestamps (e.g., on thumbnails).",
            value: "#ffffffff",
            var_css: "--timestamp-text-color",
            constant_css: `
                ytd-thumbnail-overlay-time-status-renderer {
                    color: var(--timestamp-text-color) !important;
                }
            `
        },
        {
            type: "Color",
            id: "Chanel_Color",
            name: "Channel Name Color",
            description: "The color of channel names under video titles.",
            value: "#ffffffff",
            var_css: "--channel-name-color",
            constant_css: `
                #channel-name .ytd-video-owner-renderer {
                    color: var(--channel-name-color) !important;
                }
            `
        }
    ]
};