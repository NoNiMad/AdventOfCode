import fs from "node:fs";
import path from "node:path";
import { Bench } from "tinybench";

function noop() {}
function parseArgs(args)
{
	const result = { parts: { all: true } };

	for (const arg of args)
	{
		if (arg.startsWith("-"))
		{
			// Is an option
			const option = arg.substring(1);
			switch (option)
			{
				case "b":
				case "benchmark":
					result.benchmark = new Bench();
					break;
				case "d":
				case "debug":
					result.debug = true;
					break;
				case "g1":
					result.parts.all = false;
					result.parts.golf1 = true;
					break;
				case "g2":
					result.parts.all = false;
					result.parts.golf2 = true;
					break;
				case "p1":
					result.parts.all = false;
					result.parts.part1 = true;
					break;
				case "p2":
					result.parts.all = false;
					result.parts.part2 = true;
					break;
				case "s":
				case "save":
					result.save = true;
					break;
				case "t":
				case "test":
					result.testInput = true;
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

function loadInput(filePath)
{
	let input = fs.readFileSync(filePath, "utf8");
	
	let hasBeenSanitized = false;
	if (input.includes("\r\n"))
	{
		input = input.replaceAll("\r\n", "\n");
		hasBeenSanitized = true;
	}
	if (input.endsWith("\n"))
	{
		input = input.slice(0, input.length - 1);
		hasBeenSanitized = true;
	}

	if (hasBeenSanitized)
	{
		log("Input has been sanitized.");
		fs.writeFileSync(filePath, input, "utf8");
	}
	return input;
}

function executePart(label, partFunction, input, successCb)
{
	if (args.benchmark)
	{
		args.benchmark.add(label, () => {
			partFunction(input);
		});
		return;
	}

	try
	{
		log(`--------\n ${label} \n--------\n`);
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
	const input = loadInput(inputPath);

	if (args.parts.all || args.parts.part1)
	{
		executePart("Part 1", script.part1, input, result => assignToDayData(data, { part1: result }));
	}

	if (args.parts.all || args.parts.part2)
	{
		executePart("Part 2", script.part2, input, result => assignToDayData(data, { part2: result }));
	}

	if (args.parts.all || args.parts.golf1)
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

	if (args.parts.all || args.parts.golf2)
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

	if (args.benchmark)
	{
		await args.benchmark.run();
		console.table(args.benchmark.table());
	}
	else
	{
		if (args.save)
		{
			fs.writeFileSync(dataFilePath, JSON.stringify(data, null, "\t"));
			log("Saved!");
		}
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