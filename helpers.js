export const constants = {
	charCodes: {
		a: 97,
		z: 122,
		A: 65,
		Z: 90,
		0: 48,
		9: 57
	}
};

export function isBetween(x, a, b)
{
	return x >= a && x <= b;
}

export function isBetweenStrict(x, a, b)
{
	return x > a && x < b;
}

export function isDigit(char)
{
	return isBetween(char.charCodeAt(0), constants.charCodes[0], constants.charCodes[9]);
}

export function isLowerLetter(char)
{
	return isBetween(char.charCodeAt(0), constants.charCodes.a, constants.charCodes.z);
}

export function isUpperLetter(char)
{
	return isBetween(char.charCodeAt(0), constants.charCodes.A, constants.charCodes.Z);
}

export function isLetter(char)
{
	return isLowerLetter(char) || isUpperLetter(char);
}