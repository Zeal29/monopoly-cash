<script setup lang="ts">
	import { computed } from "@vue/reactivity";
	import { ref } from "vue";
	import { Player } from "../types";
	import { updatePlayersOrders } from "../firebase/player";
	import { router } from "../router/router";
	import { setCurrentUserTurn } from "../firebase/dice";

	const gameId = router.currentRoute.value.params.id as string;

	const { players, isLoadingPlayer, myPlayer } = defineProps<{ players: Player[]; isLoadingPlayer: boolean; myPlayer: Player | null }>();

	const playerOrderList = ref(players as Player[]);
	const playerOrderComputed = computed(() => playerOrderList.value.filter((p) => p.userId !== "bank").sort((a, b) => a.playOrder - b.playOrder));

	const isUpdatingTheOrder = ref(false);
	const isUpdatingCurrentTrun = ref(false);

	function pushUp(value: Player) {
		const index = playerOrderComputed.value.indexOf(value);
		if (index === 0) return;

		const listwithOutBank = [...playerOrderComputed.value];

		const [newOrder] = listwithOutBank.splice(index, 1);

		listwithOutBank.splice(index - 1, 0, newOrder);

		playerOrderList.value = listwithOutBank;
		updateListOrder();
	}

	function pushDown(value: Player) {
		const index = playerOrderComputed.value.indexOf(value);
		if (index === playerOrderComputed.value.length - 1) return;

		const listwithOutBank = [...playerOrderComputed.value];

		const [newOrder] = listwithOutBank.splice(index, 1);

		listwithOutBank.splice(index + 1, 0, newOrder);

		playerOrderList.value = listwithOutBank;

		updateListOrder();
	}

	function updateListOrder() {
		playerOrderList.value.forEach((p, i) => (p.playOrder = i));
	}

	async function saveOrder() {
		isUpdatingTheOrder.value = true;
		await updatePlayersOrders(gameId, playerOrderList.value);
		isUpdatingTheOrder.value = false;
	}

	async function setCurrentTurn(userId: string) {
		isUpdatingCurrentTrun.value = true;
		await setCurrentUserTurn(gameId, userId);
		isUpdatingCurrentTrun.value = false;
	}
</script>

<template>
	<h1>Settings</h1>

	<ProgressSpinner v-if="isLoadingPlayer"></ProgressSpinner>

	<div v-else>
		<Button :loading="isUpdatingTheOrder" @click="saveOrder" label="Apply Order" />
		<div class="" v-for="(player, idx) in playerOrderComputed" :key="player.playerId">
			<Card class="w-full mt-3">
				<template #title> {{ player.name }} </template>
				<template #subtitle>
					<div>is Bankrupt: {{ player.isBankrupt ? "Yes" : "No" }}</div>
					<div class="mt-2">is disabled: {{ player.isDisabled ? "Yes" : "No" }}</div>
					<div class="mt-2">Order: {{ player.playOrder }}</div>
				</template>

				<template #footer>
					<Button @click="pushUp(player)" label="⬆️"></Button>
					<Button class="mx-3" @click="pushDown(player)" label="⬇️"></Button>
					<Button
						:disabled="isUpdatingCurrentTrun"
						:loading="isUpdatingCurrentTrun"
						@click="setCurrentTurn(player.userId)"
						label="Set Current Turn"
					></Button>
				</template>
			</Card>
		</div>
	</div>
</template>

<style scoped></style>
