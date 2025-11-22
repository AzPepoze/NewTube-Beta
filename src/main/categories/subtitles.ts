import { Category } from "../../styleshift/types/store";

export const SubtitlesCategory: Category = {
    Category: "🔤 Subtitles/Captions",
    Settings: [
        {
            type: "Checkbox",
            id: "NewSub",
            name: "Enable Custom Subtitle Styles",
            description: "Toggles all custom subtitle styles on or off.",
            value: true,
            enable_css: `
                .ytp-caption-segment {
                    background: transparent !important;
                    filter: drop-shadow(0px 0px 1px var(--sub-sha-color, #000)) drop-shadow(0px 0px var(--sub-sha-blur, 2px) var(--sub-sha-color, #000)) drop-shadow(0px 0px 1px var(--sub-sha-color, #000));
                    font-weight: var(--sub-width, 700);
                    letter-spacing: var(--sub-space, 2px);
                    color: var(--sub-color, #fff) !important;
                }
                .captions-text {
                    background: var(--sub-bg, #00000000) !important;
                }
                .caption-window {
                    background: transparent !important;
                }
            `,
        },
        {
            type: "Color",
            id: "Subtitle",
            name: "Subtitle Color",
            description: "The main text color of the subtitles.",
            value: "#ffffffff",
            var_css: "--sub-color",
        },
        {
            type: "Color",
            id: "CapBG",
            name: "Subtitle Background Color",
            description: "The background color of the caption box.",
            value: "#00000000",
            var_css: "--sub-bg",
        },
        {
            type: "Number_Slide",
            id: "subWidth",
            name: "Subtitle Weight",
            description: "Controls the font weight (boldness) of the subtitle text.",
            value: 700,
            min: 100,
            max: 900,
            step: 100,
            var_css: "--sub-width",
        },
        {
            type: "Number_Slide",
            id: "subSpace",
            name: "Subtitle Letter Spacing",
            description: "Controls the space between letters.",
            value: 2,
            min: 0,
            max: 10,
            step: 1,
            var_css: "--sub-space",
        },
        {
            type: "Color",
            id: "subShaColor",
            name: "Subtitle Shadow Color",
            description: "The color of the drop shadow behind the text.",
            value: "#000000ff",
            var_css: "--sub-sha-color",
        },
        {
            type: "Number_Slide",
            id: "subShaBlur",
            name: "Subtitle Shadow Blur",
            description: "The amount of blur for the drop shadow.",
            value: 2,
            min: 0,
            max: 20,
            step: 1,
            var_css: "--sub-sha-blur",
        },
        {
            type: "Checkbox",
            id: "BlurSub",
            name: "Blur Subtitle Background",
            description: "Applies a blur effect to the area behind the subtitles.",
            value: false,
            enable_css: `
                .caption-window.ytp-caption-window-bottom {
                    backdrop-filter: blur(var(--sub-bg-blur-amount, 5px)) !important;
                }
            `,
        },
        {
            type: "Number_Slide",
            id: "SubBgBlurAmount",
            name: "Subtitle Background Blur Amount",
            description: "Adjusts the blur amount for the subtitle background.",
            value: 5,
            min: 0,
            max: 50,
            step: 1,
            var_css: "--sub-bg-blur-amount",
        },
    ]
};