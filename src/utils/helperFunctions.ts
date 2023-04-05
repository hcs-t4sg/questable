export function truncate(description: string) {
	if (description.length > 40) {
		return description.slice(0, 40) + '...'
	}
	return description
}
