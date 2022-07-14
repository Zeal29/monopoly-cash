import { async } from "@firebase/util";
import { collection, doc, setDoc, getDoc, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { onUnmounted, ref } from "vue";
import { DB } from ".";
import { Game, Log, Player, User } from "../types";
import { getCurrentUser } from "../utils/auth";
import { createLog } from "./logs";
const gamesCollection = collection(DB, "games");

const getPlayerCollection = (gameId: string) => collection(gamesCollection, gameId, "players");

export async function createPlayer(gameId: string, name: string, userId: string) {
	const playerDoc = doc(getPlayerCollection(gameId));

	const player: Player = {
		playerId: playerDoc.id,
		isBankrupt: false,
		money: 1500,
		name,
		userId,
	};

	await setDoc(playerDoc, player);
}

export async function checkIfPlayerExistByUserId(gameId: string, userId: string) {
	const q = query(getPlayerCollection(gameId), where("userId", "==", userId));

	const doc = await getDocs(q);

	return doc?.docs?.[0]?.data() as Player;
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

	await createLog(gameId, userId, logType, message, newToPlayer.userId);
}
