import * as StyleShift_Functions from "../styleshift/build-in-functions/extension";
import { sleep } from "../styleshift/build-in-functions/normal";
import { Category } from "../styleshift/types/store";

const Dev_Only_Items: Category[] = [
	{
		category: "↕️ Import / Export Theme",
		settings: [
			{
				type: "Setting_Sub_Title",
				color: "#1a34ffff",
				font_size: 15,
				text_align: "center",
				text: "File (.StyleShift.zip)",
			},
			{
				type: "Button",
				id: "Export_ZIP_File",
				name: "Export File",
				description: "Description of this Button",
				color: "#1a34ffff",
				font_size: 15,
				click_function: async function () {
					const Notification = await StyleShift_Functions["Create_Notification"]({
						Icon: "🔄️",
						Title: "StyleShift - Exporting File",
						Content: "Please wait...",
						Timeout: -1,
					});

					try {
						await StyleShift_Functions["Export_StyleShift_Zip"](
							JSON.parse(await StyleShift_Functions["Export_StyleShift_JSON_Text"]())
								.Custom_StyleShift_Items,
							"Test.StyleShift.zip"
						);

						Notification.Set_Icon("✅");
						Notification.Set_Title("StyleShift - Exported File");
						Notification.Set_Content("Exported successfully!");

						await sleep(3000);

						Notification.Close();
					} catch (error) {
						Notification.Close();
						StyleShift_Functions["Create_Error"](error).then((Notification) => {
							Notification.Set_Title("StyleShift - Error exporting file");
						});
					}
				},
				text_align: "center",
				icon: "",
			},
			{
				type: "Button",
				id: "Import_ZIP_File",
				name: "Import File",
				description: "Description of this Button",
				color: "#1a34ffff",
				font_size: 15,
				click_function: async function () {
					const Notification = await StyleShift_Functions["Create_Notification"]({
						Icon: "🔄️",
						Title: "StyleShift - Choosing file",
						Content: "Please choose file...",
						Timeout: -1,
					});
					try {
						const File = await StyleShift_Functions["Get_File"](".StyleShift.zip");
						console.log("File:", File);
						await StyleShift_Functions["Import_StyleShift_Zip"](File);

						Notification.Set_Icon("✅");
						Notification.Set_Title("StyleShift - Imported File");
						Notification.Set_Content("Imported successfully!");

						await sleep(3000);

						Notification.Close();
					} catch (error) {
						Notification.Close();
						StyleShift_Functions["Create_Error"](error).then((Notification) => {
							Notification.Set_Title("StyleShift - Error importing file");
						});
					}
				},
				text_align: "center",
				icon: "",
			},
		],
	},
];

export function Get_StyleShift_Dev_Only_Items() {
	return Dev_Only_Items;
}
