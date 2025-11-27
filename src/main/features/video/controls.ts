export function setup_advanced_controls() {
	const add_loop_button = () => {
		const controls = document.querySelector(".ytp-right-controls");
		if (!controls || document.querySelector(".newtube-loop-btn")) return;

		const btn = document.createElement("button");
		btn.className = "ytp-button newtube-loop-btn";
		btn.setAttribute("aria-label", "Loop video");
		btn.title = "Loop Video (NewTube)";
		// Loop icon
		btn.innerHTML = `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><path d="M23.5,22.5H15.5V26L10.5,21L15.5,16V19.5H23.5C25.71,19.5 27.5,17.71 27.5,15.5C27.5,13.29 25.71,11.5 23.5,11.5H12.5V8.5H23.5C27.36,8.5 30.5,11.64 30.5,15.5C30.5,19.36 27.36,22.5 23.5,22.5ZM13.5,25.5H23.5V28.5H13.5V25.5Z" fill="white" id="ytp-id-17"></path><path d="M12.5,14.5H4.5V11L9.5,16L4.5,21V17.5H12.5C14.71,17.5 16.5,19.29 16.5,21.5C16.5,23.71 14.71,25.5 12.5,25.5H23.5V28.5H12.5C8.64,28.5 5.5,25.36 5.5,21.5C5.5,17.64 8.64,14.5 12.5,14.5Z" fill="white" style="display:none"></path></svg>`;

		const update_state = () => {
			const video = document.querySelector("video");
			if (video) {
				if (video.loop) {
					btn.querySelector("svg path")?.setAttribute("fill", "#3ea6ff");
				} else {
					btn.querySelector("svg path")?.setAttribute("fill", "white");
				}
			}
		};

		btn.onclick = () => {
			const video = document.querySelector("video");
			if (video) {
				video.loop = !video.loop;
				update_state();
			}
		};

		// Insert as first item in right controls (usually before subtitles/settings)
		controls.insertBefore(btn, controls.firstChild);

		// Initial sync
		update_state();
	};

	window.addEventListener("yt-navigate-finish", () => setTimeout(add_loop_button, 1000));
	setTimeout(add_loop_button, 2000);
}
