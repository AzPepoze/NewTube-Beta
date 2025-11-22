import { Category } from "../../styleshift/types/store";

export const SubscribeButtonCategory: Category = {
    Category: "▶️ Subscribe Button",
    Settings: [
        {
            type: "Checkbox",
            id: "SPSubScribe",
            name: "Enable Custom Subscribe Button Colors",
            description: "Allows you to set separate colors for the subscribe button.",
            value: false,
            enable_css: `
                .ytd-subscribe-button-renderer button.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {
                    background: var(--subscribe-bg-color) !important;
                    color: var(--subscribe-text-color) !important;
                }
            `
        },
        {
            type: "Color",
            id: "SPSubScribeBG",
            name: "Subscribe Button Background",
            description: "The background color of the subscribe button.",
            value: "#ff0000ff",
            var_css: "--subscribe-bg-color",
        },
        {
            type: "Color",
            id: "SPSubScribeColor",
            name: "Subscribe Button Text Color",
            description: "The text color of the subscribe button.",
            value: "#ffffffff",
            var_css: "--subscribe-text-color",
        },
    ]
};