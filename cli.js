import fs from "node:fs";
import path from "node:path";

function noop() {}
function parseArgs(args)
{
	const result = {};

	for (const arg of args)
	{
		if (arg.startsWith("-"))
		{
			// Is an option
			const option = arg.substring(1);
			switch (option)
			{
				case "t":
				case "test":
					result.testInput = true;
				case "d":
				case "debug":
					result.debug = true;
					break;
				case "p1":
					result.specificParts = true;
					result.part1 = true;
					break;
				case "p2":
					result.specificParts = true;
					result.part2 = true;
					break;
				case "s":
				case "save":
					result.save = true;
					break;
				case "g":
				case "golf":
					result.golf = true;
					break;
				default:
					log(`Unrecognized option: "${option}"`);
					break;
			}
		}
		else
		{
			const argAsInt = parseInt(arg, 10);
			if (isNaN(argAsInt))
			{
				error(`Invalid day number '${arg}'`);
				return null;
			}
			else
			{
				result.day = argAsInt;
			}
		}
	}

	return result;
}

const dataFilePath = "./data.json";
const defaultData = {};
function loadData()
{
	let existingData = null;
	try
	{
		existingData = JSON.parse(fs.readFileSync(dataFilePath));
	}
	catch
	{
		existingData = {};
	}
	return Object.assign(defaultData, existingData);
}
function assignToDayData(data, obj)
{
	let dayData = data[args.day];
	if (!dayData)
	{
		dayData = {};
		data[args.day] = dayData;
	}
	Object.assign(dayData, obj);
}

function executePart(label, partFunction, input, successCb)
{
	log(`--------\n ${label} \n--------\n`);

	try
	{
		const result = partFunction(input);
		log(`Result: ${result}`);
		successCb(result);
	}
	catch(exception)
	{
		error(`Error during execution: ${exception}`);
	}
}

async function main(args)
{
	global.args = args;
	global.debug = args.debug ? log : noop;

	const data = loadData();
	
	const scriptPath = path.resolve("days", args.day.toString(), "index.js");
	const inputPath = path.resolve("days", args.day.toString(), args.testInput ? "testInput.txt" : "input.txt");
	if (!fs.existsSync(scriptPath) || !fs.existsSync(inputPath))
	{
		error(`Either script or input file are missing for day ${args.day}.`);
		return;
	}
	const script = await import(`file://${scriptPath}`);
	const input = fs.readFileSync(inputPath, "utf8");

	if (!args.golf)
	{
		if (!args.specificParts || args.part1)
		{
			executePart("Part 1", script.part1, input, result => assignToDayData(data, { part1: result }));
		}
	
		if (!args.specificParts || args.part2)
		{
			executePart("Part 2", script.part2, input, result => assignToDayData(data, { part2: result }));
		}
		log("\n--------");
	}
	else
	{
		if (!args.specificParts || args.part1)
		{
			const nonGolfResult = data[args.day]?.part1;
			if (!nonGolfResult)
			{
				log(`Do the non-golf version first you funny bastard.`);
			}
			else
			{
				executePart("Part 1 (Golf)", script.part1Golf, input, result => {
					log(`Non golf-result: ${nonGolfResult}`);
					log(`Golf result: ${result}`);
					log(`=> ${result == nonGolfResult ? "GG!" : "Oops."}`);
				});
			}
		}
	
		if (!args.specificParts || args.part2)
		{
			const nonGolfResult = data[args.day]?.part2;
			if (!nonGolfResult)
			{
				log(`Do the non-golf version first you funny bastard.`);
			}
			else
			{
				executePart("Part 2 (Golf)", script.part2Golf, input, result => {
					log(`Non golf-result: ${nonGolfResult}`);
					log(`Golf result: ${result}`);
					log(`=> ${result == nonGolfResult ? "GG!" : "Oops."}`);
				});
			}
		}
		log("\n--------");
	}

	if (args.save)
	{
		fs.writeFileSync(dataFilePath, JSON.stringify(data, null, "\t"));
		log("Saved!");
	}
}

const argv = [...process.argv];
if (argv[0].endsWith("node.exe"))
{
	// Remove node and script path
	argv.splice(0, 2);	
}

global.log = console.log;
global.error = console.error;

const args = parseArgs(argv);
if (args == null)
{
	error("Failed to parse args... exiting.");
}
else
{
	main(args).catch(error);
}