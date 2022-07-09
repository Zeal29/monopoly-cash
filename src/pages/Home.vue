<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { createGame, useLoadGames } from "../firebase/game";
	import { Game } from "../types";
	import { router } from "../router/router";

	// const games = ref<Game[]>([]);

	const gameName = ref("");

	const { games, isLoadingGames } = useLoadGames();

	onMounted(() => {});

	async function createGameHandler() {
		const game = await createGame(gameName.value);
		console.log("game", game);
	}

	function onClickGo(id: string) {
		router.push(`/game/${id}/transaction`);
	}
</script>

<template>
	<h1>Games</h1>

	<form v-on:submit.prevent="createGameHandler">
		<InputText v-model="gameName" />
		<Button type="submit" label="Create Game" />
	</form>
	{{ gameName }}

	<div v-if="isLoadingGames"><ProgressSpinner /></div>
	<ul v-else>
		<li v-for="game in games" :key="game.gameId">
			game name is {{ game.name }}
			<span> <Button label="Go" @click="onClickGo(game.gameId)" /></span>
		</li>
	</ul>
</template>

<style scoped></style>
