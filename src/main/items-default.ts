import { Category } from "../styleshift/types/store";
import { VideoCategory } from "./categories/video";
import { VideoControlPanelCategory } from "./categories/video-control-panel";
import { SubtitlesCategory } from "./categories/subtitles";
import { TopbarSearchCategory } from "./categories/topbar-search";
import { ThumbnailCategory } from "./categories/thumbnail";
import { EnhancementCategory } from "./categories/enhancement";
import { ColorThemeCategory } from "./categories/color-theme";
import { SubscribeButtonCategory } from "./categories/subscribe-button";
import { TopLeftIconCategory } from "./categories/top-left-icon";
import { TabIconCategory } from "./categories/tab-icon";
import { BordersShadowsCategory } from "./categories/borders-shadows";
import { AnimationsCategory } from "./categories/animations";
import { HoverClickColorCategory } from "./categories/hover-click-color";
import { OtherSettingsCategory } from "./categories/other-settings";
import { FontsCategory } from "./categories/fonts";
import { BackgroundCategory } from "./categories/background";
import { RemoveBlackBarsCategory } from "./categories/remove-black-bars";
import { MoveToTopCategory } from "./categories/move-to-top";
import { BetaFeaturesCategory } from "./categories/beta-features";

let Default_StyleShift_Items: Category[] = [
	VideoCategory,
	VideoControlPanelCategory,
	SubtitlesCategory,
	TopbarSearchCategory,
	ThumbnailCategory,
	EnhancementCategory,
	ColorThemeCategory,
	SubscribeButtonCategory,
	TopLeftIconCategory,
	TabIconCategory,
	BordersShadowsCategory,
	AnimationsCategory,
	HoverClickColorCategory,
	OtherSettingsCategory,
	FontsCategory,
	BetaFeaturesCategory,
	BackgroundCategory,
	RemoveBlackBarsCategory,
	MoveToTopCategory,
];

export function Get_Default_Items() {
	return Default_StyleShift_Items;
}
