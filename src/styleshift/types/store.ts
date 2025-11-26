export type Category = {
	category: string;
	rainbow?: boolean;
	selector?: string;

	editable?: boolean;
	settings: Setting[];
	highlight_color?: string;
};

export type Option = {
	enable_css?: string;

	enable_function?: string | Function;
	disable_function?: string | Function;
};

export type color_obj = {
	hex: string;
	alpha: number;
};

export type Setting =
	| {
			type: "Text";
			id?: string;

			html: string;

			text_align?: "left" | "center" | "right";
			font_size?: number;

			Editable?: boolean;
	  }
	| {
			type: "Setting_Sub_Title";
			id?: string;

			text: string;

			text_align?: "left" | "center" | "right";
			color?: string;
			font_size?: number;

			Editable?: boolean;
	  }
	| {
			type: "Button";
			id?: string;
			name: string;
			description?: string;

			icon?: string;
			text_align?: "left" | "center" | "right";
			color?: string;
			font_size?: number;

			click_function?: string | Function;

			Editable?: boolean;
	  }
	| {
			type: "Checkbox";
			id: string;
			name: string;
			description?: string;

			value: boolean;

			constant_css?: string;

			setup_function?: string | Function;

			enable_css?: string;
			enable_function?: string | Function;

			disable_css?: string;
			disable_function?: string | Function;

			Editable?: boolean;
	  }
	| {
			type: "Number_Slide";
			id: string;
			name: string;
			description?: string;

			min?: number;
			max?: number;
			step?: number;
			value: number;

			//--------------

			var_css?: string;

			constant_css?: string | Function;

			setup_function?: string | Function;

			update_function?: string | Function;

			//--------------

			Editable?: boolean;
	  }
	| {
			type: "Dropdown";
			id: string;
			name: string;
			description?: string;

			value: string;

			//--------------

			constant_css?: string;

			setup_function?: string | Function;

			options: { [key: string]: Option };

			//--------------

			Editable?: boolean;
	  }
	| {
			type: "Color";
			id: string;
			name: string;
			description?: string;
			show_alpha_slider?: boolean;

			value: string;

			//--------------

			var_css?: string;

			constant_css?: string | Function;

			setup_function?: string | Function;

			update_function?: string | Function;

			//--------------

			Editable?: boolean;
	  }
	| {
			type: "Text_Input";
			id: string;
			name: string;
			description?: string;

			value: string;

			update_function?: string | ((value: string) => void);

			//--------------
			Editable?: boolean;
	  }
	| {
			type: "Image_Input";
			id: string;
			name: string;
			description?: string;

			value: string;
			MaxFileSize: number;

			//--------------
			Editable?: boolean;
	  }
	| {
			type: "Preview_Image";
			id: string;

			//--------------
			Editable?: boolean;
	  }
	| {
			type: "Custom";
			id: string;

			//--------------

			constant_css?: string;

			setup_function?: string | Function;

			setup_?: string | Function;

			ui_function?: string | Function;

			//--------------

			Editable?: boolean;
	  }
	| {
			type: "Combine_Settings";
			id?: string;
			name?: string;
			description?: string;
			sync_id: string[];
			update_function?: string;
			Editable?: boolean;
	  };
