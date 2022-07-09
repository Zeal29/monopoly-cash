<script setup lang="ts">
	import { ref } from "vue";
	import { useLoadPlayers, payAmount } from "../../firebase/player";
	import { router } from "../../router/router";
	import { getCurrentUser } from "../../utils/auth";
	import { Player, Log } from "../../types/index";

	const gameId = router.currentRoute.value.params.id as string;

	const { players, isLoadingPlayer, currentUser, myPlayer } = useLoadPlayers(gameId);

	const isPaying = ref(false);

	const amount = ref(0);

	async function paymentHandler(fromPlayer: Player, toPlayer: Player) {
		if (myPlayer.value == null) return;

		isPaying.value = true;

		await payAmount(
			gameId,
			fromPlayer.playerId,
			toPlayer.playerId,
			amount.value,
			myPlayer.value.userId,
			toPlayer.userId === "bank" ? "bankSend" : "amountTransfer",
			`${fromPlayer.name} as send ${amount.value} Rs. to ${toPlayer.name}`,
		);

		isPaying.value = false;
		amount.value = 0;
	}
</script>

<template>
	<h1>Transaction</h1>

	<InputNumber v-model="amount" placeholder="Amount" currency="USD" locale="en-US" prefix="Rs " :min="0" />

	<ProgressSpinner v-if="isLoadingPlayer"></ProgressSpinner>

	<div v-else>
		<div v-for="player in players" class="mt-3">
			<div class="border-1" v-if="myPlayer != null && myPlayer?.userId !== player.userId">
				<h4>User Name: {{ player.name }}</h4>
				<h4>isBankrupt: {{ player.isBankrupt }}</h4>
				<h4>Money: {{ player.money }}</h4>
				<Button @click="paymentHandler(myPlayer as any, player)" label="Pay" :disabled="isPaying" :loading="isPaying" />
			</div>
		</div>
	</div>
</template>

<style scoped></style>
