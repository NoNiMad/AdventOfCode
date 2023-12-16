import chalk from "chalk";
import * as helpers from "../../helpers.js";

function parseInput(input, seedsAreRanges)
{
	const almanac = {
		seeds: [],
		maps: {}
	};

	const lines = input.split("\n");
	if (seedsAreRanges)
	{
		almanac.seeds = [...lines[0].matchAll(/(\d+) (\d+)/g)].map(match => {
			const rangeStart = +match[1];
			const rangeLen = +match[2];
			return [ rangeStart, rangeLen ];
		});
	}
	else
	{
		almanac.seeds = [...lines[0].matchAll(/\d+/g)].map(el => +el[0]);
	}

	let currentMap = null;
	for (let i = 2; i < lines.length; i++)
	{
		const line = lines[i];
		if (currentMap == null)
		{
			const matches = line.match(/([a-z]+)-to-([a-z]+)/);
			currentMap = {
				source: matches[1],
				target: matches[2],
				ranges: []
			};
			almanac.maps[currentMap.source] = currentMap;
		}
		else if (line.length == 0)
		{
			currentMap = null;
		}
		else
		{
			const [_, targetRangeStart, sourceRangeStart, rangeLen] = line.match(/(\d+) (\d+) (\d+)/);
			currentMap.ranges.push({
				sourceStart: +sourceRangeStart,
				targetStart: +targetRangeStart,
				length: +rangeLen
			});
		}
	}

	return almanac;
}

function findMapId(sourceId, sourceMapName, targetMapName, maps)
{
	debug(`Looking for ${chalk.green(targetMapName)} from ${chalk.green(sourceMapName)} ${chalk.red(sourceId)}`);

	const sourceMap = maps[sourceMapName];
	const isTargetReached = sourceMap.target == targetMapName;

	debug(`\tNext map: ${chalk.green(sourceMap.target)}" (${isTargetReached ? "The" : "Not the"} final target)`)

	let targetId = sourceId;
	for (const range of sourceMap.ranges)
	{
		if (range.sourceStart <= sourceId
			&& sourceId < range.sourceStart + range.length)
		{
			debug("\tFound matching range: " + chalk.blue(`[${range.sourceStart} ; ${range.sourceStart + range.length}[ => [${range.targetStart} ; ${range.targetStart + range.length}[`));
			targetId = range.targetStart + sourceId - range.sourceStart;
			break;
		}
	}

	return isTargetReached
		? targetId
		: findMapId(targetId, sourceMap.target, targetMapName, maps);
}

export function part1(input)
{
	const almanac = parseInput(input, false);
	debug(`Finding location for ${chalk.red(almanac.seeds.length)} seeds\n`);
	const locations = [];

	for(const seed of almanac.seeds)
	{
		const location = findMapId(seed, "seed", "location", almanac.maps);
		debug(`=> Location found for seed ${chalk.red(seed)} : ${chalk.red(location)}\n`);
		locations.push(location);
	}

	return Math.min(...locations);
}

export function part2(input)
{
	const almanac = parseInput(input, true);
	debug(`Finding location for ${chalk.red(almanac.seeds.length)} seeds\n`);
	const locations = [];

	for(const seed of almanac.seeds)
	{
		const location = findMapId(seed, "seed", "location", almanac.maps);
		debug(`=> Location found for seed ${chalk.red(seed)} : ${chalk.red(location)}\n`);
		locations.push(location);
	}

	return Math.min(...locations);
}

export function part1Golf(i)
{
	return 0;
}

export function part2Golf(i)
{
	return 0;
}