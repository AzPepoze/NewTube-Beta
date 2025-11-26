import { Get_Element_Center_Position } from "../build-in-functions/normal";
import { Category } from "../types/store";
import { Start_Highlighter } from "./highlight";
import { Create_Main_Settings_UI } from "./settings/settings";

const Edtior_Width = 400;
export let Editor_UI: Awaited<ReturnType<typeof Create_Main_Settings_UI>>;
const Current_Edit_OBJ = {};
let animationFrameId: number | null = null;
let resizeObserver: ResizeObserver | null = null;

(async () => {
	Editor_UI = await Create_Main_Settings_UI({
		Show_Category_List: false,
		On_Create: function (StyleShift_Window) {
			StyleShift_Window.Window.style.width = Edtior_Width + "px";
			StyleShift_Window.Window.style.minWidth = Edtior_Width + "px";

			const targetElement = Current_Edit_OBJ["Target"];

			function Update_Position() {
				const targetElement_Center_Position = Get_Element_Center_Position(targetElement);
				let Cal_Position;

				if (targetElement_Center_Position.x < window.innerWidth / 2) {
					Cal_Position = targetElement.getBoundingClientRect().right + 10;
				} else {
					Cal_Position = targetElement.getBoundingClientRect().left - Edtior_Width - 20 - 10;
				}

				if (Cal_Position + Edtior_Width > window.innerWidth) {
					Cal_Position = window.innerWidth - Edtior_Width - 20 - 20;
				}

				StyleShift_Window.Window.style.left = `${Cal_Position}px`;

				// Continue animation loop
				animationFrameId = requestAnimationFrame(Update_Position);
			}

			// Start position updates
			Update_Position();

			// Setup resize observer for target element
			resizeObserver = new ResizeObserver(() => {
				if (animationFrameId) {
					cancelAnimationFrame(animationFrameId);
					animationFrameId = null;
				}
				if (resizeObserver) {
					resizeObserver.disconnect();
					resizeObserver = null;
				}
			});
			resizeObserver.observe(targetElement);

			StyleShift_Window.Drag_Top.addEventListener("mousedown", () => {
				if (animationFrameId) {
					cancelAnimationFrame(animationFrameId);
					animationFrameId = null;
				}
			});

			StyleShift_Window.Close.addEventListener("click", () => {
				if (animationFrameId) {
					cancelAnimationFrame(animationFrameId);
					animationFrameId = null;
				}
				if (resizeObserver) {
					resizeObserver.disconnect();
					resizeObserver = null;
				}
				Start_Highlighter();
			});
		},
	});
})();

export async function Create_Editor_UI(targetElement, This_Category: Category) {
	Current_Edit_OBJ["Target"] = targetElement;
	Current_Edit_OBJ["Category"] = This_Category;
	Editor_UI.Set_Get_Category(() => [This_Category]);
	Editor_UI.Create_UI();
}
