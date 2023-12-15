import * as helpers from "../../helpers.js";

export function part1(input)
{
	let result = 0;

	for (const line of input.split("\n"))
	{
		let cardNumber;
		const winningNumbers = [];
		const playedNumbers = [];

		let tempNumber = "";

		let step = "card";
		for (const char of line)
		{
			if (helpers.isDigit(char))
			{
				tempNumber += char;
			}
			else if (step == "card")
			{
				if (char == ":")
				{
					cardNumber = +tempNumber;
					tempNumber = "";
					step = "winning";
				}
			}
			else if (step == "winning")
			{
				if (char == " " && tempNumber != "")
				{
					winningNumbers.push(+tempNumber);
					tempNumber = "";
				}

				if (char == "|")
				{
					step = "played";
				}
			}
			else if (step == "played")
			{
				if (char == " " && tempNumber != "")
				{
					playedNumbers.push(+tempNumber);
					tempNumber = "";
				}
			}
		}

		if (step == "played" && tempNumber != "")
		{
			playedNumbers.push(+tempNumber);
			tempNumber = "";
		}

		debug(`Card ${cardNumber}: ${winningNumbers} | ${playedNumbers}`);
		const winningCount = playedNumbers.filter(number => winningNumbers.includes(number)).length;
		const points = winningCount == 0 ? 0 : 2**(winningCount - 1);
		debug(` => ${winningCount} are amongst the winning numbers -> ${points}`);
		result += points;
	}

	return result;
}

export function part2(input)
{
	const lines = input.split("\n");
	const cardsCount = [];
	for (let i = 0; i < lines.length; i++)
		cardsCount.push(1);

	for (let i = 0; i < lines.length; i++)
	{
		const line = lines[i];
		let cardNumber;
		const winningNumbers = [];
		const playedNumbers = [];

		let tempNumber = "";

		let step = "card";
		for (const char of line)
		{
			if (helpers.isDigit(char))
			{
				tempNumber += char;
			}
			else if (step == "card")
			{
				if (char == ":")
				{
					cardNumber = +tempNumber;
					tempNumber = "";
					step = "winning";
				}
			}
			else if (step == "winning")
			{
				if (char == " " && tempNumber != "")
				{
					winningNumbers.push(+tempNumber);
					tempNumber = "";
				}

				if (char == "|")
				{
					step = "played";
				}
			}
			else if (step == "played")
			{
				if (char == " " && tempNumber != "")
				{
					playedNumbers.push(+tempNumber);
					tempNumber = "";
				}
			}
		}

		if (step == "played" && tempNumber != "")
		{
			playedNumbers.push(+tempNumber);
			tempNumber = "";
		}

		debug(`Card ${cardNumber}: ${winningNumbers} | ${playedNumbers}`);
		const winningCount = playedNumbers.filter(number => winningNumbers.includes(number)).length;
		for (let j = 0; j < winningCount; j++)
		{
			cardsCount[i + 1 + j] += cardsCount[i];
		}
		
		debug(` => ${winningCount} are amongst the winning numbers`);
	}

	return cardsCount.reduce((a, v) => a + v, 0);
}

export function part1Golf(i)
{
	return 0;
}

export function part2Golf(i)
{
	return 0;
}