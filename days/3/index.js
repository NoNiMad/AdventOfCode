import * as helpers from "../../helpers.js";

function isSymbol(char)
{
	return !helpers.isDigit(char) && char !== ".";
}

function hasSymbolAroundOnLine(line, x)
{
	// Previous column
	if (x > 0 && isSymbol(line[x - 1]))
		return true;
	
	// Same column
	if (isSymbol(line[x]))
		return true;
	
	// Next column
	if (x < line.length - 1 && isSymbol(line[x + 1]))
		return true;
	
	return false;
}

function hasSymbolAround(lines, x, y)
{
	// Previous line
	if (y > 0 && hasSymbolAroundOnLine(lines[y - 1], x))
		return true;

	// Same line
	if (hasSymbolAroundOnLine(lines[y], x))
		return true;

	// Next line
	if (y < lines.length - 1 && hasSymbolAroundOnLine(lines[y + 1], x))
		return true;

	return false;
}

export function part1(input)
{
	let result = 0;

	const lines = input.split("\n");
	const lineLen = lines.length;

	for (let y = 0; y < lines.length; y++)
	{
		const line = lines[y];

		let currentNumber = "";
		let symbolFound = false;
		for (let x = 0; x < lineLen; x++)
		{
			const char = line[x];
			if (helpers.isDigit(char))
			{
				currentNumber += char;
				symbolFound |= hasSymbolAround(lines, x, y);
			}
			else if (currentNumber.length > 0)
			{
				if (symbolFound)
				{
					result += parseInt(currentNumber);
				}
				currentNumber = "";
				symbolFound = false;
			}
		}
		
		if (currentNumber.length > 0 && symbolFound)
		{
			result += parseInt(currentNumber);
		}
	}

	return result;
}

function getHashKeyFromPos(x, y)
{
	return `${x};${y}`;
}

function pushIfGearSymbol(symbols, char, x, y)
{
	if (char == "*")
	{
		debug(`Found * at (${x}, ${y})`);
		symbols[getHashKeyFromPos(x, y)] = true;
	}
}

function fillGearSymbolsAroundOnLine(symbols, y, line, x)
{
	// Previous column
	if (x > 0)
		pushIfGearSymbol(symbols, line[x - 1], x - 1, y);
	
	// Same column
	pushIfGearSymbol(symbols, line[x], x, y);
	
	// Next column
	if (x < line.length - 1)
		pushIfGearSymbol(symbols, line[x + 1], x + 1, y);
}

function fillGearSymbolsAround(symbols, lines, x, y)
{
	// Previous line
	if (y > 0)
		fillGearSymbolsAroundOnLine(symbols, y - 1, lines[y - 1], x);

	// Same line
	fillGearSymbolsAroundOnLine(symbols, y, lines[y], x);

	// Next line
	if (y < lines.length - 1)
		fillGearSymbolsAroundOnLine(symbols, y + 1, lines[y + 1], x);
}

export function part2(input)
{
	let result = 0;

	const lines = input.split("\n");
	const lineLen = lines.length;

	const gearPosToNumbers = {};

	for (let y = 0; y < lines.length; y++)
	{
		const line = lines[y];

		let currentNumber = "";
		let symbolsSet = {};
		for (let x = 0; x < lineLen; x++)
		{
			const char = line[x];
			if (helpers.isDigit(char))
			{
				currentNumber += char;
				fillGearSymbolsAround(symbolsSet, lines, x, y);
			}
			else if (currentNumber.length > 0)
			{
				for (const symbolKey of Object.keys(symbolsSet))
				{
					let numberList = gearPosToNumbers[symbolKey];
					if (!numberList)
					{
						numberList = [];
						gearPosToNumbers[symbolKey] = numberList;
					}
					numberList.push(parseInt(currentNumber));
					debug(`Adding ${currentNumber} to * at ${symbolKey}`);
				}
				
				currentNumber = "";
				symbolsSet = {};
			}
		}
		
		if (currentNumber.length > 0)
		{
			for (const symbolKey of Object.keys(symbolsSet))
			{
				let numberList = gearPosToNumbers[symbolKey];
				if (!numberList)
				{
					numberList = [];
					gearPosToNumbers[symbolKey] = numberList;
				}
				numberList.push(parseInt(currentNumber));
				debug(`Adding ${currentNumber} to * at ${symbolKey}`);
			}	
		}
	}

	for (const [symbolKey, numberList] of Object.entries(gearPosToNumbers))
	{
		if (numberList.length == 2)
		{
			debug(`Gear at ${symbolKey} contains 2 numbers: ${numberList[0]} * ${numberList[1]}`);
			result += numberList[0] * numberList[1];
		}
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