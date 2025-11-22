import { Category } from "../../styleshift/types/store";
import { setupRemoveBlackBars, destroyRemoveBlackBars } from "../features/remove-black-bars";

export const RemoveBlackBarsCategory: Category = {
    Category: "🔳 Remove black bars on video",
    Settings: [
        {
            type: "Checkbox",
            id: "DelBar",
            name: "Remove black bars top-bottom",
            description: "Analyzes the video to automatically crop out horizontal black bars.",
            value: false,
            enable_function: setupRemoveBlackBars,
            disable_function: destroyRemoveBlackBars
        },
        {
            type: "Checkbox",
            id: "UltraWide",
            name: "Fit ultrawide video (Not Implemented)",
            description: "Helps to fit ultrawide (21:9) videos better. This specific sub-feature is not yet implemented.",
            value: true
        },
        {
            type: "Checkbox",
            id: "DropFrame",
            name: "Lazy Check (Not Implemented)",
            description: "A performance-saving option. This specific sub-feature is not yet implemented.",
            value: false
        },
        {
            type: "Number_Slide",
            id: "LazyAmount",
            name: "Lazy Check Cooldown (Not Implemented)",
            description: "Adjusts how often the check is performed. This specific sub-feature is not yet implemented.",
            value: 50,
            min: -1,
            max: 200,
            step: 1
        }
    ]
};