import { collection, doc, setDoc, getDoc, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { onUnmounted, ref } from "vue";
import { DB } from ".";
import { Game, Player, User } from "../types";
import { createPlayer } from "./player";

const gamesCollection = collection(DB, "games");

export async function createGame(name: string) {
	const docRef = doc(gamesCollection);

	const user: Game = {
		color: "red",
		name,
		createdAt: new Date(),
		gameId: docRef.id,
		bankerId: null,
	};
	await setDoc(docRef, user);

	await createPlayer(docRef.id, "Bank", "bank");
}

export async function setBanker(game: Game, userId: string) {
	const docRef = doc(gamesCollection, game.gameId);

	const user: Game = {
		...game,
		bankerId: userId,
	};
	await setDoc(docRef, user);
}

export async function getGames() {
	const doc = await getDocs(gamesCollection);

	return doc?.docs.map((d) => d.data() as Game);
}

export function useLoadGames() {
	const games = ref<Game[]>([]);
	const isLoadingGames = ref(true);

	const close = onSnapshot(gamesCollection, (snapshot) => {
		games.value = snapshot.docs.map((d) => d.data() as Game).sort((a, b) => (b?.createdAt as any)?.seconds - (a?.createdAt as any)?.seconds);
		isLoadingGames.value = false;
	});

	onUnmounted(close);

	return { games, isLoadingGames };
}

export function useLoadGame(gameId: string) {
	const game = ref<Game | null>(null);
	const isLoadingGame = ref(true);

	const docRef = doc(gamesCollection, gameId);

	const close = onSnapshot(docRef, (snapshot) => {
		game.value = snapshot.data() as Game;
		console.log(game.value, "Game value");

		isLoadingGame.value = false;
	});

	onUnmounted(close);

	return { game, isLoadingGame };
}
