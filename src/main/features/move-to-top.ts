import { Load } from "../../styleshift/core/save";

let moveToTopButton: HTMLDivElement | null = null;

const handleScroll = () => {
	if (moveToTopButton) {
		if (window.scrollY > 400) {
			moveToTopButton.style.opacity = "1";
			moveToTopButton.style.pointerEvents = "auto";
		} else {
			moveToTopButton.style.opacity = "0";
			moveToTopButton.style.pointerEvents = "none";
		}
	}
};

export async function createMoveToTopButton() {
	if (moveToTopButton) return;

	const iconURL = (await Load("MoveToTop_URL")) as string;

	moveToTopButton = document.createElement("div");
	moveToTopButton.id = "styleshift-move-to-top";
	moveToTopButton.style.position = "fixed";
	moveToTopButton.style.bottom = "30px";
	moveToTopButton.style.right = "90px";
	moveToTopButton.style.width = "50px";
	moveToTopButton.style.height = "50px";
	moveToTopButton.style.background = `url(${iconURL}) no-repeat center center`;
	moveToTopButton.style.backgroundSize = "contain";
	moveToTopButton.style.cursor = "pointer";
	moveToTopButton.style.zIndex = "9999";
	moveToTopButton.style.opacity = "0";
	moveToTopButton.style.pointerEvents = "none";
	moveToTopButton.style.transition = "opacity 0.3s ease";

	moveToTopButton.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});

	document.body.appendChild(moveToTopButton);
	window.addEventListener("scroll", handleScroll, { passive: true });
	handleScroll(); // Initial check
}

export function destroyMoveToTopButton() {
	if (moveToTopButton) {
		moveToTopButton.remove();
		moveToTopButton = null;
	}
	window.removeEventListener("scroll", handleScroll);
}

export async function updateMoveToTopIcon() {
	if (moveToTopButton) {
		const iconURL = (await Load("MoveToTop_URL")) as string;
		moveToTopButton.style.backgroundImage = `url(${iconURL})`;
	}
}
