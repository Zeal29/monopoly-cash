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
	logType: "amountTransfer" | "bankruptcy" | "bankReceive" | "bankSend";
	message: string;
	toUserId: string | undefined | null;
};

export type Player = {
	playerId: string;
	userId: string;
	name: string;
	money: number;
	isBankrupt: boolean;
};

export type Game = {
	gameId: string;
	name: string;
	createdAt: Date;
	color: string;
	bankerId: string | null;
};

export type Roll = {
	rollId: string;
	value: number;
	userId: string;
	username: string;
	createdAt: Date;
};
