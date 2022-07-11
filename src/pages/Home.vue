<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { createGame, useLoadGames } from "../firebase/game";
	import { Game } from "../types";
	import { router } from "../router/router";
	import { logout } from "../utils/auth";

	// const games = ref<Game[]>([]);

	const gameName = ref("");

	const {
		games,

		isLoadingGames,
	} = useLoadGames();

	onMounted(() => {});

	async function createGameHandler() {
		if (gameName.value.trim() === "") {
			alert("Please enter a game name");
			return;
		}
		const value = gameName.value.trim();
		gameName.value = "";

		const game = await createGame(value);
		console.log("game", game);
	}

	function onClickGo(id: string) {
		router.push(`/game/${id}`);
	}

	function logoutHandler() {
		logout();
		router.push(`/login`);
	}
</script>

<template>
	<div class="grid mx-3">
		<div class="col md:col-6 md:col-offset-3">
			<div class="flex justify-content-between p-2">
				<h1>Games</h1>

				<Button class="p-button-text" icon="pi-sign-out pi" label="Logout" @click="logoutHandler" />
			</div>

			<div class="mx-auto grid mb-5">
				<form v-on:submit.prevent="createGameHandler" class="col">
					<div class="p-inputgroup">
						<InputText placeholder="New Game Name" v-model="gameName" />
						<Button :disabled="gameName.trim() == ''" icon="pi pi-plus" type="submit" label="Create" />
					</div>
				</form>
			</div>

			<div v-if="isLoadingGames" class="flex align-items-center justify-content-center h-19rem col">
				<ProgressSpinner class="" />
			</div>

			<div v-else>
				<Card class="w-full mb-3" v-for="(game, idx) in games" :key="game.gameId">
					<template #header>
						<div class="p-2">#{{ idx + 1 }}</div>
					</template>

					<template #title> {{ game.name }} </template>
					<template #subtitle>
						<!-- {{ new Date((game.createdAt as any).seconds) + (game.createdAt as any).nanoseconds) }} -->
						Created At: {{ ((game.createdAt as any).toDate() as Date).toLocaleString() }}
					</template>
					<template #footer>
						<Button icon="pi pi-play" label="Play" @click="onClickGo(game.gameId)" />
					</template>
				</Card>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
