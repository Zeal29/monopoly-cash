<script setup lang="ts">
	import { computed, onMounted, ref, watch } from "vue";
	import { setBanker, useLoadGame } from "../../firebase/game";
	import { checkIfPlayerExistByUserId, createPlayer, useLoadPlayers } from "../../firebase/player";
	import { router } from "../../router/router";
	import { Game, User } from "../../types";
	import { getCurrentUser } from "../../utils/auth";
	import TabView from "primevue/tabview";
	import TabPanel from "primevue/tabpanel";
	import Dice from "../../components/Dice.vue";
	import Log from "./Log.vue";
	import { useLoadLogs } from "../../firebase/logs";
	import Transaction from "./Transaction.vue";
	import Bank from "./Bank.vue";
	import { useToast } from "primevue/usetoast";
	import { setCurrentUserTurn, useLoadRolls } from "../../firebase/dice";
	import Settings from "../../components/Settings.vue";

	const vueRouter = ref(router);
	const toast = useToast();

	const gameId = router.currentRoute.value.params.id as string;

	const { players, isLoadingPlayer, currentUser, myPlayer } = useLoadPlayers(gameId);
	const { isLoadingRolls, rolls } = useLoadRolls(gameId, (rolls) => {
		const first = rolls[0];

		if (first == null) return;

		if (currentUser.value?.userId === first.userId) {
			return;
		}

		toast.add({
			severity: "info",
			summary: `${first.username} rolled ${first.value}`,
			life: 3000,
		});
	});

	const {
		game,

		isLoadingGame,
	} = useLoadGame(gameId);
	const { isLoadingLogs, logs } = useLoadLogs(gameId, (logs) => {
		const first = logs[0];

		if (first == null) return;

		toast.add({
			severity: currentUser.value?.userId === first.toUserId ? "success" : "info",
			summary: "New Log",
			detail: first.message,
			life: 3000,
		});
	});

	const playerWithTurn = computed(() => players.value.find((p) => p.userId === game.value?.currentPlayerId) ?? null);

	const isMoneyHidden = ref(true);

	const bankerName = computed(() => players.value?.find((player) => player?.userId === game.value?.bankerId)?.name);

	onMounted(async () => {
		if (currentUser.value == null) {
			alert("there is some issue");
			return;
		}

		const { currentPlayer: player } = await checkIfPlayerExistByUserId(gameId, currentUser.value.userId);

		if (player != null) return;

		debugger;
		await createPlayer(gameId, currentUser.value.username, currentUser.value.userId, players.value.length, 1500);
	});

	watch(game, async (newGame) => {
		if (newGame?.bankerId == null && currentUser.value != null) {
			await setBanker(newGame as Game, currentUser.value.userId);
			await setCurrentUserTurn(gameId, currentUser.value.userId);
		}
	});

	function goBackHome() {
		vueRouter.value.push("/");
	}
</script>

<template>
	<div v-if="currentUser != null" class="grid mx-3">
		<div class="col md:col-offset-3 md:col-6 mt-3">
			<Card v-if="!isLoadingGame">
				<template #header>
					<div class="flex justify-content-end align-items-end p-2">
						<Button class="p-button-text" icon="pi-home pi" label="back to Home" @click="goBackHome" />
					</div>
				</template>

				<template #title> Info </template>
				<template #content>
					<div>
						<p>User Name: {{ currentUser.username }}</p>
						<p>Game Name: {{ game?.name }}</p>
						<p>is Bankrupt: {{ myPlayer?.isBankrupt }}</p>
						<p @click="isMoneyHidden = !isMoneyHidden">Money: {{ !isMoneyHidden ? myPlayer?.money : "******" }}</p>
						<p>Banker Name: {{ bankerName }}</p>
						<p>Current Turn: {{ playerWithTurn?.name }}</p>
						<p>My Turn Index: {{ myPlayer?.playOrder }}</p>
					</div>
				</template>
			</Card>
			<div v-else>
				<ProgressSpinner />
			</div>

			<TabView scrollable class="mt-3" style="max-width: calc(100vw - 3rem)">
				<TabPanel header="Dice" v-if="playerWithTurn != null">
					<Dice
						:myPlayer="myPlayer"
						:currentTurnPlayer="playerWithTurn"
						:players="players"
						:isMyTurn="playerWithTurn?.userId === myPlayer?.userId"
						:isLoadingRolls="isLoadingRolls"
						:rolls="rolls"
					/>
				</TabPanel>
				<TabPanel header="Transactions" v-if="myPlayer != null">
					<Transaction :players="players" :isLoadingPlayer="isLoadingPlayer" :myPlayer="myPlayer" />
				</TabPanel>
				<TabPanel header="Logs">
					<Log :logs="logs" :isLoadingLogs="isLoadingLogs" />
				</TabPanel>
				<TabPanel header="Bank" v-if="myPlayer?.userId === game?.bankerId">
					<Bank :players="players" :isLoadingPlayer="isLoadingPlayer" :myPlayer="myPlayer" :game="game" />
				</TabPanel>
				<TabPanel header="Settings" v-if="myPlayer?.userId === game?.bankerId">
					<Settings :players="players" :isLoadingPlayer="isLoadingPlayer" :myPlayer="myPlayer" />
				</TabPanel>
				<TabPanel header="  " :disabled="true"> </TabPanel>
			</TabView>
		</div>
	</div>
</template>

<style scoped></style>
