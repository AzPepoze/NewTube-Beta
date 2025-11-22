import { Category } from "../../styleshift/types/store";

export const TopLeftIconCategory: Category = {
    Category: "💠 Top-Left Icon",
    Settings: [
        {
            type: "Checkbox",
            id: "ReplaceYT",
            name: "Enable Custom Top-Left Icon",
            description: "Replaces the YouTube logo with a custom image.",
            value: false,
            enable_css: `
                ytd-topbar-logo-renderer #logo-icon {
                    display: none !important;
                }
                ytd-topbar-logo-renderer {
                    background-image: url(var(--top-icon-url)) !important;
                    background-position: var(--top-icon-x, 50%) var(--top-icon-y, 50%) !important;
                    background-size: var(--top-icon-size, 100%) !important;
                    background-repeat: var(--top-icon-repeat, no-repeat) !important;
                    transform: var(--top-icon-flip, scaleX(1));
                }
            `
        },
        {
            type: "Text_Input",
            id: "ReplaceYTURL",
            name: "Icon Image URL",
            description: "URL for the custom icon image.",
            value: "https://i.gifer.com/17xo.gif",
            update_function: function(value) {
                document.documentElement.style.setProperty('--top-icon-url', `url(${value})`);
            }
        },
        {
            type: "Number_Slide",
            id: "TopIconX",
            name: "Image Position X",
            description: "Horizontal position of the custom icon.",
            value: 50,
            min: 0,
            max: 100,
            step: 1,
            var_css: "--top-icon-x"
        },
        {
            type: "Number_Slide",
            id: "TopIconY",
            name: "Image Position Y",
            description: "Vertical position of the custom icon.",
            value: 50,
            min: 0,
            max: 100,
            step: 1,
            var_css: "--top-icon-y"
        },
        {
            type: "Number_Slide",
            id: "YTSize",
            name: "Image Size",
            description: "Size of the custom icon.",
            value: 100,
            min: 10,
            max: 300,
            step: 5,
            var_css: "--top-icon-size"
        },
        {
            type: "Checkbox",
            id: "TopIconFlip",
            name: "Flip Image",
            description: "Flips the custom icon horizontally.",
            value: false,
            enable_css: `ytd-topbar-logo-renderer { --top-icon-flip: scaleX(-1); }`,
            disable_css: `ytd-topbar-logo-renderer { --top-icon-flip: scaleX(1); }`
        },
        {
            type: "Checkbox",
            id: "TopIconRepeat",
            name: "Repeat Image",
            description: "Repeats the custom icon image.",
            value: false,
            enable_css: `ytd-topbar-logo-renderer { --top-icon-repeat: repeat; }`,
            disable_css: `ytd-topbar-logo-renderer { --top-icon-repeat: no-repeat; }`
        },
        {
            type: "Checkbox",
            id: "IconFill",
            name: "Sync Icon Color with Theme",
            description: "Makes the default YouTube icon color match the main theme color. Does not work if custom icon is enabled.",
            value: true,
            enable_css: `
                #logo-icon.ytd-topbar-logo-renderer .yt-spec-icon-shape-fill {
                    fill: var(--theme-color, #FF0000) !important;
                }
            `
        }
    ]
};