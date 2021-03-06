import { collection, doc, setDoc, getDoc, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { onUnmounted, ref } from "vue";
import { DB } from ".";
import { Game, Log, Player, User } from "../types";
const gamesCollection = collection(DB, "games");

const getLogsCollection = (gameId: string) => collection(gamesCollection, gameId, "logs");

export function useLoadLogs(gameId: string, onLogs?: (logs: Log[]) => void) {
	const logs = ref<Log[]>([]);
	const isLoadingLogs = ref(true);

	const close = onSnapshot(getLogsCollection(gameId), (snapshot) => {
		logs.value = snapshot.docs.map((d) => d.data() as Log).sort((a, b) => (b?.createdAt as any)?.seconds - (a?.createdAt as any)?.seconds);
		isLoadingLogs.value = false;

		console.log("snapshot", snapshot);
		onLogs?.(logs.value);
	});

	onUnmounted(close);

	return { logs, isLoadingLogs };
}

export async function createLog(
	gameId: string,
	userId: string,
	logType: Log["logType"],
	message: string,
	toUserId?: string,
	value: number | null = null,
) {
	const docRef = doc(getLogsCollection(gameId));

	const log: Log = {
		logId: docRef.id,
		userId,
		createdAt: new Date(),
		logType,
		message,
		toUserId,
		value,
	};
	await setDoc(docRef, log);
}
