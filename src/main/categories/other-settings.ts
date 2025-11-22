import { Category } from "../../styleshift/types/store";

export const OtherSettingsCategory: Category = {
    Category: "⚛️ Other settings",
    Settings: [
        {
            type: "Dropdown",
            id: "ScWidthNew",
            name: "Scrollbar Width",
            description: "Changes the width of the browser scrollbar on YouTube.",
            value: "thin",
            options: {
                "auto": { enable_css: `html { scrollbar-width: auto; }` },
                "thin": { enable_css: `html { scrollbar-width: thin; }` },
                "none": { enable_css: `html { scrollbar-width: none; }` },
            }
        },
        {
            type: "Checkbox",
            id: "VBG",
            name: "Remove Theater Background",
            description: "Removes the black background behind the video in theater mode.",
            value: true,
            enable_css: `
                #full-bleed-container:has(div.html5-video-player:not(.ytp-fullscreen)) {
                    background-color: transparent !important;
                }
            `
        },
        {
            type: "Checkbox",
            id: "HideYourChannel",
            name: "Hide 'Your channel' Link",
            description: "Hides the 'Your channel' link from the left sidebar.",
            value: false,
            enable_css: `
                #section-items > ytd-guide-entry-renderer:nth-child(2) {
                    display: none !important;
                }
            `
        },
        {
            type: "Checkbox",
            id: "HideYourVID",
            name: "Hide 'Your videos' Link",
            description: "Hides the 'Your videos' link from the left sidebar.",
            value: false,
            enable_css: `
                #section-items > ytd-guide-entry-renderer:nth-child(4) {
                    display: none !important;
                }
            `
        }
    ]
};