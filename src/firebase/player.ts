import { async } from "@firebase/util";
import { collection, doc, setDoc, getDoc, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { onUnmounted, ref } from "vue";
import { DB } from ".";
import { Game, Log, Player, User } from "../types";
import { getCurrentUser } from "../utils/auth";
import { createLog } from "./logs";
const gamesCollection = collection(DB, "games");

const getPlayerCollection = (gameId: string) => collection(gamesCollection, gameId, "players");

export async function createPlayer(gameId: string, name: string, userId: string, playOrder: number, money: number = 1500) {
	const playerDoc = doc(getPlayerCollection(gameId));

	const player: Player = {
		playerId: playerDoc.id,
		isBankrupt: false,
		money,
		isDisabled: false,
		playOrder,
		name,
		userId,
		accuracyPoints: 100,
	};

	await setDoc(playerDoc, player);
}

export async function checkIfPlayerExistByUserId(gameId: string, userId: string) {
	const q = query(getPlayerCollection(gameId), where("userId", "==", userId));

	const doc = await getDocs(q);

	const currentPlayer = doc?.docs?.[0]?.data() as Player;

	return {
		currentPlayer,
		playersList: doc?.docs?.map((d) => d.data() as Player),
	};
}

export function useLoadPlayers(gameId: string) {
	const players = ref<Player[]>([]);
	const isLoadingPlayer = ref(true);
	const myPlayer = ref<Player | null>(null);

	const currentUser = ref(getCurrentUser());

	const close = onSnapshot(getPlayerCollection(gameId), (snapshot) => {
		players.value = snapshot.docs.map((d) => d.data() as Player);
		isLoadingPlayer.value = false;

		myPlayer.value = players.value.find((p) => p.userId === currentUser.value?.userId) ?? null;
	});

	onUnmounted(close);

	return { players, isLoadingPlayer, currentUser, myPlayer };
}

export async function payAmount(
	gameId: string,
	fromPlayerId: string,
	toPlayerId: string,
	amount: number,
	userId: string,
	logType: Log["logType"],
	message: string,
) {
	const fromPlayerDoc = doc(getPlayerCollection(gameId), fromPlayerId);
	const toPlayerDoc = doc(getPlayerCollection(gameId), toPlayerId);

	const fromPlayer = (await getDoc(fromPlayerDoc)).data() as Player;
	const toPlayer = (await getDoc(toPlayerDoc)).data() as Player;

	if (fromPlayer.money < amount) {
		throw new Error("Not enough money");
	}

	if (toPlayer.isBankrupt) {
		throw new Error("Player is bankrupt");
	}

	const newFromPlayer: Player = {
		...fromPlayer,
		money: fromPlayer.money - amount,
	};

	const newToPlayer: Player = {
		...toPlayer,
		money: toPlayer.money + amount,
	};

	await setDoc(fromPlayerDoc, newFromPlayer);
	await setDoc(toPlayerDoc, newToPlayer);

	await createLog(gameId, userId, logType, message, newToPlayer.userId, amount);
}

export function updatePlayersOrders(gameId: string, players: Player[]) {
	const promises: Promise<void>[] = [];
	for (const player of players) {
		const playerDoc = doc(getPlayerCollection(gameId), player.playerId);
		promises.push(setDoc(playerDoc, player));
	}

	return Promise.all(promises);
}

export async function spendAccuracyPoints(gameId: string, playerId: string, accuracyPoints: number) {
	const playerDoc = doc(getPlayerCollection(gameId), playerId);

	const player = (await getDoc(playerDoc)).data() as Player;

	await createLog(
		gameId,
		player.userId,
		"accuracyPointsUsed",
		`${player.name} has spent ${accuracyPoints} points out of ${player.accuracyPoints} points`,
		player.userId,
		accuracyPoints,
	);

	return setDoc(playerDoc, {
		...player,
		accuracyPoints: player.accuracyPoints - accuracyPoints,
	});
}

export async function acquireAccuracyPoints(gameId: string, playerId: string, accuracyPoints: number) {
	const playerDoc = doc(getPlayerCollection(gameId), playerId);

	const player = (await getDoc(playerDoc)).data() as Player;

	await createLog(
		gameId,
		player.userId,
		"accuracyPointsGained",
		`${player.name} has acquired ${accuracyPoints} points into his own ${player.accuracyPoints} points`,
		player.userId,
		accuracyPoints,
	);

	return setDoc(playerDoc, {
		...player,
		accuracyPoints: player.accuracyPoints + accuracyPoints,
	});
}
