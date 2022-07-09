<script setup lang="ts">
	import { computed, onMounted, ref, watch } from "vue";
	import { setBanker, useLoadGame } from "../../firebase/game";
	import { checkIfPlayerExistByUserId, createPlayer, useLoadPlayers } from "../../firebase/player";
	import { router } from "../../router/router";
	import { Game, User } from "../../types";
	import { getCurrentUser } from "../../utils/auth";

	const vueRouter = ref(router);

	const gameId = router.currentRoute.value.params.id as string;

	const { players, isLoadingPlayer, currentUser, myPlayer } = useLoadPlayers(gameId);

	const { game, isLoadingGame } = useLoadGame(gameId);

	const isMoneyHidden = ref(true);

	const bankerName = computed(() => players.value?.find((player) => player?.userId === game.value?.bankerId)?.name);

	onMounted(async () => {
		debugger;

		if (currentUser.value == null) {
			alert("there is some issue");
			return;
		}

		const player = await checkIfPlayerExistByUserId(gameId, currentUser.value.userId);

		if (player != null) return;

		await createPlayer(gameId, currentUser.value.username, currentUser.value.userId);
	});

	watch(game, async (newGame) => {
		if (newGame?.bankerId == null && currentUser.value != null) {
			await setBanker(newGame as Game, currentUser.value.userId);
		}
	});
</script>

<template>
	<div v-if="currentUser != null" class="border-1 grid">
		<div class="col md:col-6 md:col-offset-3 border-1 mx-3">
			<Card v-if="!isLoadingGame">
				<template #title> Info </template>
				<template #content>
					<div>
						<h4>User Name: {{ currentUser.username }}</h4>
						<h4>Game Name: {{ game?.name }}</h4>
						<h4>is Bankrupt: {{ myPlayer?.isBankrupt }}</h4>
						<h4 @click="isMoneyHidden = !isMoneyHidden">Money: {{ !isMoneyHidden ? myPlayer?.money : "******" }}</h4>
						<h4>Banker Name: {{ bankerName }}</h4>
					</div>
				</template>
			</Card>
			<div v-else>
				<ProgressSpinner />
			</div>

			<router-link :to="`/game/${vueRouter.currentRoute.params.id}/transaction`">transaction</router-link>
			<router-link class="mx-3" :to="`/game/${vueRouter.currentRoute.params.id}/log`">Log</router-link>
			<router-link v-if="myPlayer?.userId === game?.bankerId" :to="`/game/${vueRouter.currentRoute.params.id}/bank`">bank</router-link>
			<router-view></router-view>
		</div>
	</div>
</template>

<style scoped></style>
