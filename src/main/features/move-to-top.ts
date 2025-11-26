import { load } from "../../styleshift/core/save";

let move_to_top_button: HTMLDivElement | null = null;

const handle_scroll = () => {
	if (move_to_top_button) {
		if (window.scrollY > 400) {
			move_to_top_button.style.opacity = "1";
			move_to_top_button.style.pointerEvents = "auto";
		} else {
			move_to_top_button.style.opacity = "0";
			move_to_top_button.style.pointerEvents = "none";
		}
	}
};

export async function create_move_to_top_button() {
	if (move_to_top_button) return;

	const icon_url = (await load("MoveToTop_URL")) as string;

	move_to_top_button = document.createElement("div");
	move_to_top_button.id = "styleshift-move-to-top";
	move_to_top_button.style.position = "fixed";
	move_to_top_button.style.bottom = "30px";
	move_to_top_button.style.right = "90px";
	move_to_top_button.style.width = "50px";
	move_to_top_button.style.height = "50px";
	move_to_top_button.style.background = `url(${icon_url}) no-repeat center center`;
	move_to_top_button.style.backgroundSize = "contain";
	move_to_top_button.style.cursor = "pointer";
	move_to_top_button.style.zIndex = "9999";
	move_to_top_button.style.opacity = "0";
	move_to_top_button.style.pointerEvents = "none";
	move_to_top_button.style.transition = "opacity 0.3s ease";

	move_to_top_button.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});

	document.body.appendChild(move_to_top_button);
	window.addEventListener("scroll", handle_scroll, { passive: true });
	handle_scroll(); // Initial check
}

export function destroy_move_to_top_button() {
	if (move_to_top_button) {
		move_to_top_button.remove();
		move_to_top_button = null;
	}
	window.removeEventListener("scroll", handle_scroll);
}

export async function update_move_to_top_icon() {
	if (move_to_top_button) {
		const icon_url = (await load("MoveToTop_URL")) as string;
		move_to_top_button.style.backgroundImage = `url(${icon_url})`;
	}
}
