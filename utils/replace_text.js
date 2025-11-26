const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
if (args.length < 2) {
	console.log("Usage: node utils/replace_text.js <search_pattern> <replace_pattern> [directory]");
	process.exit(1);
}

const search_pattern = args[0];
const replace_pattern = args[1];
const directory = args[2] || "src";

console.log(`Replacing "${search_pattern}" with "${replace_pattern}" in ${directory}...`);

function get_all_files(dir_path, array_of_files) {
	const files = fs.readdirSync(dir_path);
	array_of_files = array_of_files || [];

	files.forEach(function (file) {
		const full_path = path.join(dir_path, file);
		if (fs.statSync(full_path).isDirectory()) {
			array_of_files = get_all_files(full_path, array_of_files);
		} else {
			array_of_files.push(full_path);
		}
	});

	return array_of_files;
}

try {
	const files = get_all_files(directory);
	// Using direct search pattern (no \b) to test if that was the issue.
	// We can re-add \b if needed via CLI arg or manual logic later.
	// For now, since input names are unique like 'Get_StyleShift_Items', strict boundary is less critical
	// if the name is unique. But for 'Setting' it is critical.
	// I'll stick to NO \b for this test run, but ideally I want it back.
	// Actually, I'll add it back but construct it carefully.
	// No, let's try WITHOUT \b first to be sure.
	const regex = new RegExp(search_pattern, "g");

	let count = 0;
	files.forEach((file) => {
		if (!file.match(/\.(ts|tsx|js|jsx)$/)) return;

		const content = fs.readFileSync(file, "utf8");
		const new_content = content.replace(regex, replace_pattern);

		if (new_content !== content) {
			fs.writeFileSync(file, new_content, "utf8");
			console.log(`Modified: ${file}`);
			count++;
		}
	});

	console.log(`Total files modified: ${count}`);
} catch (e) {
	console.error("Error:", e.message);
}
