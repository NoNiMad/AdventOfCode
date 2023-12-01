import * as helpers from "../../helpers.js";

export function part1(input)
{
	const inputLen = input.length;

	let result = 0;

	let firstDigit = null;
	let lastDigit = null;
	for (let i = 0; i < inputLen; i++)
	{
		const c = input[i];
		
		if (c == "\n" || i == inputLen - 1)
		{
			const number = parseInt(firstDigit + lastDigit);
			debug(`Adding ${number}`);
			result += number;

			firstDigit = null;
			lastDigit = null;
		}
		else if (helpers.isDigit(c))
		{
			if (firstDigit == null)
				firstDigit = c;

			lastDigit = c;
		}
	}
	return result;
}

export function part2(input)
{
	const numbersAsString = [ "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ];
	const lines = input.split("\n");

	let result = 0;
	for (const line of lines)
	{
		debug(line);
		let firstDigit = null;
		let lastDigit = null;
		for (const lineIdx in line)
		{
			const c = line[lineIdx];
			if (helpers.isDigit(c))
			{
				if (firstDigit == null)
					firstDigit = c;
				lastDigit = c;
			}
			else
			{
				for (const numIdx in numbersAsString)
				{
					const numberString = numbersAsString[numIdx];
					if (numberString == line.substr(lineIdx, numberString.length))
					{
						const numIdxString = numIdx.toString();
						if (firstDigit == null)
							firstDigit = numIdxString;

						lastDigit = numIdxString;
						break;
					}
				}
			}
		}

		const number = parseInt(firstDigit + lastDigit);
		result += number;
		debug(`=> ${number} => ${result}\n`);
	}
	return result;
}

export function part1Golf(i)
{
	return i.split("\n").map(l=>[...l].filter(c=>c>"/"&&c<":")).reduce((s,l)=>s+(+l[0])*10+(+l[l.length-1]),0);
}

export function part2Golf(i)
{
	// Flemme
	return 0;
}