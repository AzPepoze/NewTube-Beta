import { Dynamic_Append, Create_Error } from "../../build-in-functions/extension";
import { Scroll_On_Click, sleep, insert_after } from "../../build-in-functions/normal";
import { Loaded_Developer_Modules } from "../../core/extension";
import { Load, Save_All } from "../../core/save";
import { Get_StyleShift_Dev_Only_Items } from "../../../main/items-styleshift-dev";
import { in_setting_page, Update_All } from "../../run";
import {
	Add_Category,
	Remove_Setting,
	Get_Setting_Category,
	Remove_Category,
	Get_StyleShift_Data_Type,
} from "../../settings/items";
import { Category } from "../../types/store";
import { Show_Config_UI } from "../config";
import { Create_StyleShift_Window, Animation_Time } from "../extension";
import { Settings_UI } from "./setting-components";

export function Setup_Left_Title_Animation(Title) {
	Title.style.transform = "translateY(40px)";
	Title.style.opacity = "0";
}

export async function Create_Main_Settings_UI({
	Show_Category_List = true,
	On_Create = null as (StyleShift_Window: Awaited<ReturnType<typeof Create_StyleShift_Window>>) => void,
	On_Remove = null as () => void,
	Get_Category = null as () => Category[] | Promise<Category[]>,
}) {
	let Settings_Window, Update_Setting_Interval, Scroll_Category, Settings_Container;

	const Return_OBJ = {
		Create_UI: async function (Skip_Animation = false) {
			console.log(Settings_Window);
			if (Settings_Window) {
				Return_OBJ.Recreate_UI();
				return;
			}

			Settings_Window = await Create_StyleShift_Window({
				Skip_Animation,
			});

			console.log("Created_StyleShift_Window");
			const Window = Settings_Window.Window;

			Window.style.width = "47%";
			Window.style.height = "80%";
			Window.style.minWidth = "600px";
			Window.style.minHeight = "250px";

			if (in_setting_page) {
				Window.style.width = "100%";
				Window.style.height = "100%";
				Window.style.resize = "none";
			}

			//------------------------------------------------

			const Main_Frame = await Settings_UI["Setting_Frame"](false, false, { x: false, y: false }, true);

			Main_Frame.style.width = "calc(100% - 5px)";
			Main_Frame.style.height = "-webkit-fill-available";
			Main_Frame.style.gap = "10px";
			Main_Frame.style.overflow = "hidden";
			Window.append(Main_Frame);

			//------------------------------------------------

			if (Show_Category_List) {
				Scroll_Category = document.createElement("div");
				Scroll_Category.className = "STYLESHIFT-Scrollable";
				Scroll_Category.style.minWidth = "100px";
				Scroll_Category.style.width = "250px";
				Scroll_Category.setAttribute("Left", "true");
				Main_Frame.append(Scroll_Category);
			}

			//------------------------------------------------

			const Settings_Frame = await Settings_UI["Setting_Frame"](false, true, { x: false, y: false }, true);
			Settings_Frame.style.width = "-webkit-fill-available";
			Settings_Frame.style.height = "100%";
			Settings_Frame.style.gap = "10px";
			Main_Frame.append(Settings_Frame);

			const Search_Input = document.createElement("input");
			Search_Input.className = "STYLESHIFT-Search";
			Search_Input.placeholder = "🔍 Search";
			Settings_Frame.append(Search_Input);

			Settings_Container = document.createElement("div");
			Settings_Container.className = "STYLESHIFT-Scrollable";
			Settings_Frame.append(Settings_Container);

			//---------------------------------------------------

			Settings_Window.Close.addEventListener(
				"click",
				() => {
					Return_OBJ.Remove_UI();
				},
				{ once: true }
			);

			//---------------------------------------------------

			const Left_UI = [];
			const Right_UI = [];

			const Created_Dev_Only_Category = [];

			for (const This_Category of await Get_Category()) {
				const { Category_Title, Category_Frame } = await Create_Category_UI(
					Settings_Container,
					This_Category
				);

				const Left_Category_Title = await Settings_UI["Left-Title"](This_Category.category, Skip_Animation);

				Scroll_On_Click(Left_Category_Title, Category_Title);

				if (Show_Category_List) {
					Left_UI.push(Left_Category_Title);
					Scroll_Category.append(Left_Category_Title);
				}

				Right_UI.push(Category_Title);

				//------------------------------

				console.log(Loaded_Developer_Modules);

				if (Loaded_Developer_Modules) {
					const Get_Dev_Only_Category = Get_StyleShift_Dev_Only_Items().find(
						(x) => x.category == This_Category.category
					);

					console.log("Test", Get_Dev_Only_Category);

					if (Get_Dev_Only_Category) {
						Created_Dev_Only_Category.push(Get_Dev_Only_Category.category);

						for (const This_Setting_Only of Get_Dev_Only_Category.settings) {
							await Create_Setting_UI_Element_With_Able_Developer_Mode(
								Category_Frame,
								This_Setting_Only
							);
						}
					}
				}

				//------------------------------

				if (This_Category.editable && (await Load("Developer_Mode"))) {
					Dynamic_Append(
						Category_Frame,
						await Settings_UI["Add_Setting_Button"](This_Category.settings)
					);
				}

				await Settings_UI["Space"](Settings_Container);

				//------------------------------------------------------
			}

			if (await Load("Developer_Mode")) {
				for (const Category of Get_StyleShift_Dev_Only_Items()) {
					if (!Created_Dev_Only_Category.includes(Category.category)) {
						await Create_Category_UI(Settings_Container, Category);
					}
				}
			}

			if (Show_Category_List && (await Load("Developer_Mode"))) {
				const Add_Button = (
					await Settings_UI["Button"]({
						name: "+",
						color: "#FFFFFF",
						text_align: "center",
						click_function: function () {
							Add_Category("🥳 New_Category");
						},
					})
				).Button;
				Add_Button.className += " STYLESHIFT-Add-Category-Button";

				Add_Button.style.padding = "5px";
				Add_Button.style.marginInline = "10px";
				Add_Button.style.marginTop = "3px";

				Left_UI.push(Add_Button);
				Scroll_Category.append(Add_Button);

				if (!Skip_Animation) {
					Setup_Left_Title_Animation(Add_Button);
				}
			}

			//------------------------------------------------------

			if (Show_Category_List && !Skip_Animation) {
				requestAnimationFrame(function () {
					for (let Left_Order = 0; Left_Order < Left_UI.length; Left_Order++) {
						const Left_Category_Title = Left_UI[Left_Order];
						setTimeout(() => {
							Left_Category_Title.style.transform = "";
							Left_Category_Title.style.opacity = "";
						}, 50 * Left_Order);
					}
				});
			}

			//------------------------------------------------------

			let Current_Selected: HTMLElement;

			if (Show_Category_List) {
				Update_Setting_Interval = setInterval(async function () {
					const Last_Index = Right_UI.length - 1;

					for (let index = 0; index <= Last_Index; index++) {
						const Settings_Container_Box = Settings_Container.getBoundingClientRect();
						if (
							index == Last_Index ||
							(Right_UI[index].getBoundingClientRect().top - 10 <= Settings_Container_Box.top &&
								Right_UI[index + 1].getBoundingClientRect().top - 10 >=
									Settings_Container_Box.top) ||
							(index == 0 &&
								Right_UI[index].getBoundingClientRect().top >= Settings_Container_Box.top)
						) {
							if (Current_Selected == Left_UI[index]) {
								break;
							}
							if (Current_Selected) {
								Current_Selected.removeAttribute("Selected");
							}
							Current_Selected = Left_UI[index];
							Current_Selected.setAttribute("Selected", "");
							break;
						}
					}
				}, 100);
			}

			if (On_Create) {
				On_Create(Settings_Window);
			}
		},
		Remove_UI: function (Skip_Animation = false, delay = false) {
			if (Settings_Window) {
				clearInterval(Update_Setting_Interval);
				if (Skip_Animation) {
					const BG_FRAME = Settings_Window.BG_Frame;
					requestAnimationFrame(() => {
						BG_FRAME.remove();
					});
				} else {
					Settings_Window.Run_Close();
				}
				Settings_Window = null;
			}
		},
		Recreate_UI: async function () {
			if (Settings_Window) {
				const Last_Scroll = [0, 0];

				if (Show_Category_List) {
					Last_Scroll[0] = Scroll_Category.scrollTop;
				}
				Last_Scroll[1] = Settings_Container.scrollTop;

				Settings_Window.Window.style.animation = "";
				const Last_Style = Settings_Window.Window.style.cssText;
				console.log(Last_Style);
				Return_OBJ.Remove_UI(true, true);

				//----------------------------------------

				await Return_OBJ.Create_UI(true);

				Settings_Window.Window.style.cssText = Last_Style;

				requestAnimationFrame(function () {
					if (Show_Category_List) {
						Scroll_Category.scrollTo(0, Last_Scroll[0]);
					}

					Settings_Container.scrollTo(0, Last_Scroll[1]);
				});
			}
		},
		Toggle: function () {
			if (Settings_Window) {
				Return_OBJ.Remove_UI();
			} else {
				Return_OBJ.Create_UI();
			}
		},

		Set_Get_Category: function (New_Function: () => Category[] | Promise<Category[]> | null) {
			Get_Category = New_Function;
			if (Settings_Window) {
				Return_OBJ.Recreate_UI();
			}
		},
	};

	return Return_OBJ;
}

//------------------------------

export async function Create_Config_UI_Function(Editable = false, Config_Function: Function): Promise<Function> {
	if (Editable && (await Load("Developer_Mode"))) {
		return Config_Function;
	}
}

function Create_Setting_Space(Size = 20, Gap = 0) {
	const Space = document.createElement("div");
	Space.style.height = Size + "px";
	Space.style.transition = `all ${Animation_Time}s`;

	async function Show() {
		Space.style.height = Size + Gap + "px";
		await sleep(Animation_Time * 1000);
	}

	async function Hide() {
		Space.style.height = Gap + "px";
		await sleep(Animation_Time * 1000);
	}

	function Set_Size(Value) {
		Space.style.height = Value + "px";
	}

	function Set_Gap(Value) {
		Gap = Value;
		Space.style.marginTop = -Gap + "px";
		Space.style.marginBottom = -Gap + "px";
	}
	Set_Gap(Gap);

	return {
		Show,
		Hide,
		Set_Size,
		Set_Gap,
		Element: Space,
	};
}

let Draging_Setting;

async function Create_Base_UI_Element(UI_Type, This_Data) {
	try {
		return await Settings_UI[UI_Type](This_Data);
	} catch (error) {
		Create_Error(`${error}\n\n${JSON.stringify(This_Data, null, 2)}`);
		return null; // Return null or handle the error appropriately
	}
}

async function Add_Drag(Frame, Parent, This_Data) {
	const Move_Button = (
		await Settings_UI["Button"]({
			name: "☰",
			text_align: "center",
		})
	).Button;
	Move_Button.className += " STYLESHIFT-Config-Button";
	Frame.append(Move_Button);

	Move_Button.addEventListener("mousedown", async function (event) {
		event.preventDefault();

		const Frame_Bound = Frame.getBoundingClientRect();
		const Offset = event.clientY - Frame_Bound.top;

		Draging_Setting = {
			Size: Frame_Bound.height,
			Data: This_Data,
		};

		Frame.style.width = `${Frame_Bound.width}px`;
		Frame.style.height = `${Frame_Bound.height}px`;
		Frame.style.position = "absolute";
		Frame.style.pointerEvents = "none";
		Frame.style.zIndex = "1";

		const Space = Create_Setting_Space(
			Frame_Bound.height,
			Number(getComputedStyle(Parent).gap.replace("px", ""))
		);
		Space.Show();
		Parent.insertBefore(Space.Element, Frame);

		requestAnimationFrame(() => {
			Space.Hide();
		});

		const Scroller = Parent.parentElement;
		let Current_Mouse_Event = event;

		Scroller.setAttribute("Draging", "");

		//---------------------------------

		let Render_Drag = true;

		function Update_Drag_Function() {
			if (!Render_Drag) return;

			Frame.style.top = `${
				Current_Mouse_Event.clientY - Scroller.getBoundingClientRect().top + Scroller.scrollTop - Offset
			}px`;

			requestAnimationFrame(Update_Drag_Function);
		}
		Update_Drag_Function();

		//---------------------------------

		function On_Drag(event) {
			Current_Mouse_Event = event;
		}

		document.addEventListener("mousemove", On_Drag);

		document.addEventListener(
			"mouseup",
			function () {
				document.removeEventListener("mousemove", On_Drag);
				Render_Drag = false;

				Frame.style.width = "";
				Frame.style.height = "";
				Frame.style.position = "";
				Frame.style.pointerEvents = "";
				Frame.style.zIndex = "";

				Scroller.removeAttribute("Draging");

				Draging_Setting = null;
				Space.Element.remove();
			},
			{ once: true }
		);
	});
}

async function Add_Drop_Target(Frame, Parent, This_Data, Data_Type) {
	// await Wait_One_Frame();
	const Space = Create_Setting_Space(0, 5);
	requestAnimationFrame(() => {
		Space.Set_Gap(Number(getComputedStyle(Parent).gap.replace("px", "")));
		Space.Hide();
	});
	Space.Element.className = "STYLESHIFT-Drag-Hint";

	insert_after(Space.Element, Frame, Parent);

	let Current_Hover = 0;
	function Space_Update_Hover(Hover) {
		Current_Hover += Hover;

		if (Draging_Setting) {
			if (Current_Hover != 0) {
				Space.Set_Size(Draging_Setting.Size);
				Space.Show();
			}
		}

		if (Current_Hover == 0) {
			Space.Hide();
		}
	}

	Frame.addEventListener("mouseenter", () => {
		Space_Update_Hover(1);
	});
	Space.Element.addEventListener("mouseenter", () => {
		Space_Update_Hover(1);
	});

	Frame.addEventListener("mouseleave", () => {
		Space_Update_Hover(-1);
	});
	Space.Element.addEventListener("mouseleave", function () {
		Space_Update_Hover(-1);
	});

	Space.Element.addEventListener("mouseup", () => {
		if (Draging_Setting) {
			Remove_Setting(Draging_Setting.Data);

			const This_Category: Category | 0 =
				Data_Type == "Category" ? This_Data : Get_Setting_Category(This_Data);
			let This_Setting_Index = 0;

			if (This_Category == 0) {
				Create_Error(`Category of ${This_Data} not found`);
				return;
			}

			if (Data_Type != "Category") {
				This_Setting_Index = This_Category.settings.findIndex((Setting) => Setting == This_Data) + 1;
			}

			try {
				This_Category.settings.splice(This_Setting_Index, 0, Draging_Setting.Data);
			} catch (error) {
				Create_Error(error);
				return;
			}

			Save_All();
			Update_All();
		}
	});
}

async function Add_Edit_Delete_Buttons(Frame, Main_Element, This_Data, Data_Type) {
	const Edit_Button = (
		await Settings_UI["Button"]({
			name: "✏️",
			text_align: "center",
			color: "#3399ff",
			click_function: function () {
				Show_Config_UI(Main_Element.Config_UI_Function);
			},
		})
	).Button;
	Edit_Button.className += " STYLESHIFT-Config-Button";
	Frame.append(Edit_Button);

	const Delete_Button = (
		await Settings_UI["Button"]({
			name: "🗑️",
			text_align: "center",
			color: "#FF0000",
			click_function:
				Data_Type == "Category"
					? async function () {
							Remove_Category(This_Data);
					  }
					: async function () {
							Remove_Setting(This_Data);
					  },
		})
	).Button;
	Delete_Button.className += " STYLESHIFT-Config-Button";
	Frame.append(Delete_Button);
}

async function Setup_Developer_Mode_Wrapper(Parent, This_Data, Main_Element, Data_Type) {
	const Frame = Settings_UI["Setting_Frame"](false, false, { x: true, y: true }, true);
	Frame.className += " STYLESHIFT-Config-Frame";

	if (Data_Type != "Category") {
		await Add_Drag(Frame, Parent, This_Data);
	}

	//--------------------------- Main Content Frame
	const Main_Frame = Settings_UI["Setting_Frame"](
		false,
		false,
		{ x: true, y: true },
		This_Data.type == "Button" || Data_Type == "Category"
	);
	Main_Frame.className += " STYLESHIFT-Main-Setting-Frame";
	Frame.append(Main_Frame);

	Dynamic_Append(Main_Frame, Main_Element);

	//--------------------------- Edit & Delete Buttons
	await Add_Edit_Delete_Buttons(Frame, Main_Element, This_Data, Data_Type);

	//--------------------------- Append Final Frame
	Parent.append(Frame);

	//--------------------------- Drop Target
	Add_Drop_Target(Frame, Parent, This_Data, Data_Type);
}

export async function Create_Setting_UI_Element_With_Able_Developer_Mode(Parent: HTMLDivElement, This_Data) {
	const Data_Type = Get_StyleShift_Data_Type(This_Data);
	const UI_Type = Data_Type == "Category" ? "Title" : This_Data.type;

	const Main_Element = await Create_Base_UI_Element(UI_Type, This_Data);
	if (!Main_Element) return null; // Handle case where element creation failed

	if ((await Load("Developer_Mode")) && This_Data.Editable) {
		await Setup_Developer_Mode_Wrapper(Parent, This_Data, Main_Element, Data_Type);
	} else {
		Dynamic_Append(Parent, Main_Element);
	}

	return Main_Element;
}

export async function Create_Category_UI(Parent, This_Category: Category) {
	const Category_Frame = await Settings_UI["Setting_Frame"](true, true);
	Category_Frame.className += " STYLESHIFT-Category-Frame";
	Parent.append(Category_Frame);

	const Category_Title = (await Create_Setting_UI_Element_With_Able_Developer_Mode(Category_Frame, This_Category))
		.Frame;

	for (const This_Setting of This_Category.settings) {
		try {
			await Create_Setting_UI_Element_With_Able_Developer_Mode(Category_Frame, This_Setting);
		} catch (error) {
			Create_Error(`At ${This_Category.category} - ${JSON.stringify(This_Setting, null, 2)}\n${error}`).then(
				(Notification) => {
					Notification.Set_Title("StyleShift - Create UI error");
				}
			);
		}
	}

	return { Category_Title, Category_Frame };
}
