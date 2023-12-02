import * as helpers from "../../helpers.js";

export function part1(input)
{
	const maxAmount = {
		"red": 12,
		"green": 13,
		"blue": 14
	};

	let result = 0;

	const games = input.split("\n");
	for (const game of games)
	{
		const gameId = +game.match(/Game (\d+):/)[1];
		let gameIsPossible = true;

		for (const cubeGroup of game.matchAll(/(\d+) (red|green|blue)/g))
		{
			const amount = +cubeGroup[1];
			const color = cubeGroup[2];
			if (amount > maxAmount[color])
			{
				debug(`Game ${gameId}: Too many ${color} cubes: ${amount} > ${maxAmount[color]}`);
				gameIsPossible = false;
				break;
			}

			if (!gameIsPossible)
				break;
		}

		if (gameIsPossible)
			result += gameId;
	}

	return result;
}

export function part2(input)
{
	let result = 0;

	const games = input.split("\n");
	for (const i in games)
	{
		const game = games[i];
		const minAmounts = {
			red: 0,
			green: 0,
			blue: 0
		};

		debug(game);

		for (const set of game.matchAll(/(?:\d+ (?:red|green|blue)(?:, )?)+(?:;|$)/g))
		{
			debug(set[0]);
			for (const cubeGroup of set[0].matchAll(/(\d+) (red|green|blue)/g))
			{
				const amount = +cubeGroup[1];
				const color = cubeGroup[2];
				if (amount > minAmounts[color])
				{
					minAmounts[color] = amount;
				}
			}
		}

		debug(`=> Needs min: ${minAmounts.red} red, ${minAmounts.green} green, ${minAmounts.blue} blue`);
		debug();
		result += minAmounts.red * minAmounts.green * minAmounts.blue;
	}

	return result;
}

export function part1Golf(i)
{
	return 0;
}

export function part2Golf(i)
{
	return 0;
}