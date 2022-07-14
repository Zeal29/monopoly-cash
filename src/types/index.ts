export interface User {
	username: string;
	password: string;
	userId: string;
	createdAt: Date;
}

export type Log = {
	logId: string;
	userId: string;
	createdAt: Date;
	logType: "amountTransfer" | "bankruptcy" | "bankReceive" | "bankSend" | "accuracyPointsUsed" | "accuracyPointsGained";
	message: string;
	toUserId: string | undefined | null;
	value?: number | null;
};

export type Player = {
	playerId: string;
	userId: string;
	name: string;
	money: number;
	isBankrupt: boolean;
	isDisabled: boolean;
	playOrder: number;
	accuracyPoints: number;
};

export type Game = {
	gameId: string;
	name: string;
	createdAt: Date;
	color: string;
	bankerId: string | null;
	currentPlayerId: string | null;
	lockGame: boolean;
};

export type Roll = {
	rollId: string;
	value: number;
	userId: string;
	username: string;
	createdAt: Date;
};
