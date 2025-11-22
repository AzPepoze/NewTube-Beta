const esbuild = require("esbuild");
const chokidar = require("chokidar");
const fs = require("fs-extra");
const path = require("path");

/*
-------------------------------------------------------
Configuration
-------------------------------------------------------
*/
const args = process.argv.slice(2);
const isProduction = args.includes("--production");
const isOnce = args.includes("--once");

/*
-------------------------------------------------------
Utils Functions
-------------------------------------------------------
*/
function getFileNameFromPath(filePath) {
	const parts = filePath.split("/");
	return parts[parts.length - 1];
}

/*
-------------------------------------------------------
Firefox Compatibility Functions
-------------------------------------------------------
*/
async function replaceForFirefoxText(data) {
	const replacements = [
		{ from: /webkit-fill/g, to: "moz" },
		{ from: /-webkit-mask-box/g, to: "mask" },
		{ from: /webkit-slider-runnable-track/g, to: "moz-range-track" },
		{ from: /webkit-slider-thumb/g, to: "moz-range-thumb" },
		{ from: /webkit/g, to: "moz" },
		{ from: /nowrap/g, to: "pre" },
	];

	return replacements.reduce((text, { from, to }) => text.replace(from, to), data);
}

async function replaceForFirefox(filePath) {
	try {
		const data = await fs.readFile(filePath, "utf8");

		if (!filePath.endsWith(".css") && !filePath.endsWith(".js")) {
			console.log(`Skipping file '${filePath}'`);
			return;
		}

		const modifiedContent = await replaceForFirefoxText(data);
		await fs.writeFile(filePath, modifiedContent, "utf8");
		console.log(`File '${getFileNameFromPath(filePath)}' updated successfully!`);
	} catch (err: any) {
		console.error("Error:", err.message);
	}
}

/*
-------------------------------------------------------
Build Functions
-------------------------------------------------------
*/
async function processFunctions(codePath) {
	let code = await fs.readFile(codePath, "utf8");
	const functionNames = [];

	code = code.replace(/\bexport\s+(async\s+)?function\s+([\w$]+)\s*\(/g, (_, asyncKeyword, name) => {
		functionNames.push(name);
		return `${asyncKeyword || ""}function ${name}(`;
	});

	functionNames.forEach((name) => {
		const wrapRegex = new RegExp(`\\b(async\\s+)?function\\s+${name}\\s*\\(`, "g");
		const callRegex = new RegExp(`\\b${name}\\s*\\(`, "g");
		code = code
			.replace(
				wrapRegex,
				(_, asyncKeyword) => `StyleShift["Build-in"]["${name}"] = ${asyncKeyword || ""}function (`
			)
			.replace(callRegex, `StyleShift["Build-in"]["${name}"](`);
	});

	return code;
}

async function generateBuildInFunctions(buildPath) {
	const functionsList = fs.readFileSync(
		path.join(__dirname, "../src/styleshift/build-in-functions/extension.ts"),
		"utf-8"
	);

	const functionNames = [
		...new Set([...functionsList.matchAll(/\bexport (async\s*function|function)?\s*(\w+)\(/g)].map((x) => x[2])),
	];

	const functionsListData = functionNames
		.map(
			(name) =>
				`StyleShift["Build-in"]["${name}"] = async function(...args){return await StyleShift["Build-in"]["_Call_Function"]("${name}",...args)};`
		)
		.join("");

	const normalFunctions = await fs.readFile(path.join(__dirname, "../temp/normal.js"), "utf8");
	const buildInFunctions = await fs.readFile(path.join(buildPath, "build-in.js"), "utf8");

	return `StyleShift = {"Build-in":{},"Custom":{}};${normalFunctions}${buildInFunctions.replace(
		/\n/g,
		""
	)}${functionsListData}window['StyleShift'] = StyleShift;`;
}

/*
-------------------------------------------------------
Main Build Process
-------------------------------------------------------
*/
let isBuilding = false;

async function build() {
	if (isBuilding) return;
	isBuilding = true;

	try {
		console.log("Building");
		const buildPath = path.join(__dirname, "../out/build");
		const tempPath = path.join(__dirname, "../temp");

		// Copy extension files
		fs.copySync(path.join(__dirname, "../src/extension"), buildPath, {
			filter: (src) => {
				const relativePath = path.relative(path.join(__dirname, "../src/extension"), src);
				return !relativePath.startsWith("modules");
			},
		});

		// Build main bundle
		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/styleshift/run.ts")],
			bundle: true,
			outfile: path.join(buildPath, "styleshift.js"),
			platform: "browser",
			minify: isProduction,
			loader: {
				".ttf": "file",
			},
		});

		// Process functions
		fs.copySync(
			path.join(__dirname, "../src/styleshift/build-in-functions/normal.ts"),
			path.join(tempPath, "normal.ts")
		);

		const codePath = path.join(tempPath, "normal.ts");
		const processedCode = await processFunctions(codePath);
		fs.writeFileSync(codePath, processedCode);

		// Build processed functions
		await esbuild.build({
			entryPoints: [path.join(tempPath, "normal.ts")],
			outfile: path.join(tempPath, "normal.js"),
			platform: "browser",
			minify: isProduction,
			keepNames: true,
		});

		await esbuild.build({
			entryPoints: [path.join(__dirname, "../src/styleshift/communication/web-page.ts")],
			outfile: path.join(buildPath, "build-in.js"),
			platform: "browser",
		});

		// Generate and write build-in functions
		const buildInFunctionsData = await generateBuildInFunctions(buildPath);
		await fs.writeFile(path.join(buildPath, "build-in.js"), buildInFunctionsData, "utf8");

		// Create distribution builds
		const chromiumPath = path.join(__dirname, "../out/dist/chromium");
		const firefoxPath = path.join(__dirname, "../out/dist/firefox");

		// fs.removeSync(chromiumPath);
		// fs.removeSync(firefoxPath);

		fs.copySync(buildPath, chromiumPath);
		fs.copySync(buildPath, firefoxPath);

		// Process Firefox-specific files
		await replaceForFirefox(path.join(firefoxPath, "style.css"));
		await replaceForFirefox(path.join(firefoxPath, "styleshift.js"));

		console.log("Built!");
		console.log("--------------------------------");
	} catch (error) {
		console.error("Build Error:", error);
		console.log("Retrying build in 500ms...");
		setTimeout(build, 500);
	} finally {
		isBuilding = false;
		try {
			fs.removeSync(path.join(__dirname, "../temp"));
		} catch (error) {
			console.error("Cleanup Error:", error);
			setTimeout(() => fs.removeSync(path.join(__dirname, "../temp")), 500);
		}
	}
}

/*
-------------------------------------------------------
Build Process Initialization
-------------------------------------------------------
*/
if (isOnce) {
	build();
} else {
	chokidar.watch(path.join(__dirname, "../src")).on("all", async (event, path: string) => {
		console.log(event, getFileNameFromPath(path));
		await build();
	});
}

export {};
