import { Category } from "../../styleshift/types/store";
import { enableNewYoutubeLayout, disableNewYoutubeLayout } from "../features/beta";

export const BetaFeaturesCategory: Category = {
    Category: "🌠 Beta features!",
    Settings: [
        {
            type: "Text",
            html: "Warning: These features are experimental and may not work as expected. A page reload is often required."
        },
        {
            type: "Checkbox",
            id: "NewYoutubeLayout",
            name: "Force Enable New YouTube Layout",
            description: "Tries to force YouTube to use its newer, experimental UI layout. Requires a page reload.",
            value: false,
            enable_function: enableNewYoutubeLayout,
            disable_function: disableNewYoutubeLayout
        },
        {
            type: "Checkbox",
            id: "Theme_by_video",
            name: "Theme By Video (UI Only)",
            description: "UI placeholder. Changes theme colors based on the video thumbnail. (Functionality not implemented)",
            value: false
        },
        {
            type: "Checkbox",
            id: "Visualizer",
            name: "Audio Visualizer (UI Only)",
            description: "UI placeholder. Shows an audio visualizer on the video. (Functionality not implemented)",
            value: false
        },
        {
            type: "Checkbox",
            id: "NewVDOanima",
            name: "New Video Animations (UI Only)",
            description: "UI placeholder. Adds new animations for play, pause, volume changes, etc. (Functionality not implemented)",
            value: false
        }
    ]
};