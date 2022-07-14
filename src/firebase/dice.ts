import { async } from "@firebase/util";
import { collection, doc, setDoc, getDoc, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { onUnmounted, ref } from "vue";
import { DB } from ".";
import { Game, Log, Player, Roll, User } from "../types";
import { getCurrentUser } from "../utils/auth";
import { createLog } from "./logs";
const gamesCollection = collection(DB, "games");

const getRollsCollection = (gameId: string) => collection(gamesCollection, gameId, "rolls");

export async function createRoll(gameId: string, username: string, userId: string, rollValue: number) {
	const rollDoc = doc(getRollsCollection(gameId));

	const roll: Roll = {
		userId,
		username,
		createdAt: new Date(),
		rollId: rollDoc.id,
		value: rollValue,
	};

	await setDoc(rollDoc, roll);
}

export function useLoadRolls(gameId: string, onRoll?: (logs: Roll[]) => void) {
	const rolls = ref<Roll[]>([]);
	const isLoadingRolls = ref(true);

	const close = onSnapshot(getRollsCollection(gameId), (snapshot) => {
		rolls.value = snapshot.docs.map((d) => d.data() as Roll).sort((a, b) => (b?.createdAt as any)?.seconds - (a?.createdAt as any)?.seconds);
		isLoadingRolls.value = false;

		onRoll?.(rolls.value);
	});

	onUnmounted(close);

	return { rolls, isLoadingRolls };
}

export async function setCurrentUserTurn(gameId: string, userId: string) {
	const gameDocRef = doc(gamesCollection, gameId);
	const currentGame = await getDoc(gameDocRef);

	const game: Game = {
		...(currentGame.data() as Game),
		currentPlayerId: userId,
	};

	await setDoc(gameDocRef, game);
}
