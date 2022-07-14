<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { useLoadPlayers, payAmount } from "../../firebase/player";
	import { router } from "../../router/router";
	import { Game, Player } from "../../types/index";
	import { computed } from "@vue/reactivity";
	import { setBanker, useLoadGame } from "../../firebase/game";

	const gameId = router.currentRoute.value.params.id as string;

	const { players, isLoadingPlayer, myPlayer, game } = defineProps<{
		players: Player[];
		isLoadingPlayer: boolean;
		myPlayer: Player | null;
		game: Game | null;
	}>();

	const isPaying = ref(false);

	const amount = ref(0);

	const bank = computed(() => players.find((player) => player.userId === "bank"));

	onMounted(() => {
		console.log(myPlayer?.userId, game?.bankerId);

		if (myPlayer?.userId !== game?.bankerId) {
			router.push(`/game/${gameId}/transaction`);
		}
	});

	async function paymentHandler(fromPlayer: Player, toPlayer: Player) {
		if (myPlayer == null || amount.value <= 0) return;

		if (myPlayer.userId !== game?.bankerId) {
			alert("You are not the banker 🤣 Trying to Hack 🖕");
			return;
		}

		isPaying.value = true;

		await payAmount(
			gameId,
			fromPlayer.playerId,
			toPlayer.playerId,
			amount.value,
			myPlayer.userId,
			"bankReceive",
			`${fromPlayer.name} as send ${amount.value} Rs. to ${toPlayer.name}`,
		);

		isPaying.value = false;
		amount.value = 0;
	}

	async function makeBankerHandler(newBankerUserId: string) {
		if (game == null) return;

		const res = prompt("Are you sure you want to make this player the banker? (y/n)");

		if (res === "y" || res === "Y") {
			setBanker(game, newBankerUserId);
			router.push(`/game/${gameId}`);
		}
	}
</script>

<template>
	<div v-if="myPlayer?.userId === game?.bankerId">
		<h1>Bank</h1>

		<span class="p-float-label mt-3">
			<InputNumber id="taransactionAmount" v-model="amount" placeholder="Amount" currency="USD" locale="en-US" prefix="Rs " :min="0" />

			<label for="taransactionAmount">Transacton Amount</label>
		</span>

		<ProgressSpinner v-if="isLoadingPlayer"></ProgressSpinner>

		<div v-else>
			<div v-for="player in players" class="mt-3">
				<Card class="w-full mt-3" v-if="myPlayer != null && bank?.userId !== player.userId">
					<template #title> {{ player.name }} </template>
					<template #subtitle> is Bankrupt: {{ player.isBankrupt ? "Yes" : "No" }} </template>
					<template #footer>
						<div class="flex flex-column">
							<Button
								block
								icon="pi pi-money-bill"
								@click="paymentHandler(bank as any, player)"
								:label="`Pay ${amount} Rs. from Bank`"
								:disabled="isPaying || amount <= 0"
								:loading="isPaying"
							/>
							<Button
								block
								class="p-button-secondary p-button-outlined mt-2"
								@click="makeBankerHandler(player.userId)"
								label="Make Banker"
								:disabled="isPaying"
								:loading="isPaying"
							/>
						</div>
					</template>
				</Card>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
