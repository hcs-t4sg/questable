export function truncate(description: string, length: number) {
	if (description.length > length) {
		return description.slice(0, length) + '...'
	}
	return description
}

// Link to formulas used: https://www.reddit.com/r/Gloomhaven/comments/c6mt74/levels_xp_quadratic_equations_for_a_good_time/

// Calculate Level Base on XP
export function levelUp(xp: number): number {
	return Math.floor((-15 + Math.sqrt(289 + 1.6 * xp)) / 2)
}

// Calculate XP for Level
export function xpCalc(level: number): number {
	return 2.5 * Math.pow(level, 2) + 37.5 * level - 40
}
