export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomMinMax(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
