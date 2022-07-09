<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { useLoadPlayers, payAmount } from "../../firebase/player";
	import { router } from "../../router/router";
	import { Player } from "../../types/index";
	import { computed } from "@vue/reactivity";
	import { setBanker, useLoadGame } from "../../firebase/game";
	import { getCurrentUser } from "../../utils/auth";

	const gameId = router.currentRoute.value.params.id as string;
	const { game } = useLoadGame(gameId);

	const { players, isLoadingPlayer, myPlayer } = useLoadPlayers(gameId);

	const isPaying = ref(false);

	const amount = ref(0);

	const bank = computed(() => players.value.find((player) => player.userId === "bank"));

	onMounted(() => {
		debugger;
		console.log(myPlayer.value?.userId, game.value?.bankerId);

		if (myPlayer.value?.userId !== game.value?.bankerId) {
			router.push(`/game/${gameId}/transaction`);
		}
	});

	async function paymentHandler(fromPlayer: Player, toPlayer: Player) {
		if (myPlayer.value == null) return;

		if (myPlayer.value.userId !== game.value?.bankerId) {
			alert("You are not the banker 🤣 Trying to Hack 🖕");
			return;
		}

		isPaying.value = true;

		await payAmount(
			gameId,
			fromPlayer.playerId,
			toPlayer.playerId,
			amount.value,
			myPlayer.value.userId,
			"bankReceive",
			`${fromPlayer.name} as send ${amount.value} Rs. to ${toPlayer.name}`,
		);

		isPaying.value = false;
		amount.value = 0;
	}

	async function makeBankerHandler(newBankerUserId: string) {
		if (game.value == null) return;

		setBanker(game.value, newBankerUserId);

		router.push(`/game/${gameId}/transaction`);
	}
</script>

<template>
	<div v-if="myPlayer?.userId === game?.bankerId">
		<h1>Bank</h1>

		<InputNumber v-model="amount" placeholder="Amount" currency="USD" locale="en-US" prefix="Rs " :min="0" />

		<ProgressSpinner v-if="isLoadingPlayer"></ProgressSpinner>

		<div v-else>
			<div v-for="player in players" class="mt-3">
				<div class="border-1 p-3" v-if="myPlayer != null && bank?.userId !== player.userId">
					<h4>User Name: {{ player.name }}</h4>
					<h4>isBankrupt: {{ player.isBankrupt }}</h4>
					<h4>Money: {{ player.money }}</h4>
					<Button @click="paymentHandler(bank as any, player)" label="Pay" :disabled="isPaying" :loading="isPaying" />
					<Button
						class="ml-3 p-button-secondary"
						@click="makeBankerHandler(player.userId)"
						label="Make Banker"
						:disabled="isPaying"
						:loading="isPaying"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
