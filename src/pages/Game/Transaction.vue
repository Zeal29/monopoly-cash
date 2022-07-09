<script setup lang="ts">
	import { ref } from "vue";
	import { useLoadPlayers, payAmount } from "../../firebase/player";
	import { router } from "../../router/router";
	import { getCurrentUser } from "../../utils/auth";
	import { Player, Log } from "../../types/index";

	const gameId = router.currentRoute.value.params.id as string;

	const { players, isLoadingPlayer, myPlayer } = defineProps<{ players: Player[]; isLoadingPlayer: boolean; myPlayer: Player | null }>();

	// const { players, isLoadingPlayer, currentUser, myPlayer } = useLoadPlayers(gameId);

	const isPaying = ref(false);

	const amount = ref(0);

	async function paymentHandler(fromPlayer: Player, toPlayer: Player) {
		if (myPlayer == null) return;

		isPaying.value = true;

		await payAmount(
			gameId,
			fromPlayer.playerId,
			toPlayer.playerId,
			amount.value,
			myPlayer.userId,
			toPlayer.userId === "bank" ? "bankSend" : "amountTransfer",
			`${fromPlayer.name} as send ${amount.value} Rs. to ${toPlayer.name}`,
		);

		isPaying.value = false;
		amount.value = 0;
	}
</script>

<template>
	<h1>Transactions</h1>

	<span class="p-float-label mt-3">
		<InputNumber id="taransactionAmount" v-model="amount" placeholder="Amount" currency="USD" locale="en-US" prefix="Rs " :min="0" />

		<label for="taransactionAmount">Transacton Amount</label>
	</span>

	<ProgressSpinner v-if="isLoadingPlayer"></ProgressSpinner>

	<div v-else>
		<div class="" v-for="(player, idx) in players" :key="player.playerId">
			<Card class="w-full mt-3" v-if="player.userId !== myPlayer?.userId">
				<template #title> {{ player.name }} </template>
				<template #subtitle> is Bankrupt: {{ player.isBankrupt ? "Yes" : "No" }} </template>
				<template #footer>
					<Button
						icon="pi pi-money-bill"
						@click="paymentHandler(myPlayer as any, player)"
						label="Pay"
						:disabled="isPaying"
						:loading="isPaying"
					/>
				</template>
			</Card>
		</div>
	</div>
</template>

<style scoped></style>
