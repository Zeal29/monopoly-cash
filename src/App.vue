<script setup lang="ts">
	// This starter template is using Vue 3 <script setup> SFCs
	// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
	import { ref } from "vue";
	import HelloWorld from "./components/HelloWorld.vue";

	// import Dialog from "primevue/dialog";
	import { createUser, findUser } from "./firebase/users";
	const isVisible = ref(true);

	async function createU() {
		const res = await createUser("Hammad", "Ghafoor");

		console.log("res", res);
	}

	async function findUserHandler() {
		const res = await findUser("Hammad", "Ghafoor1");

		console.log("findUserHandler res", res);
	}
</script>

<template>
	<Toast />
	<router-view></router-view>
</template>

<style>
	body {
		font-family: var(
			--font-family,
			-apple-system,
			BlinkMacSystemFont,
			"Segoe UI",
			Roboto,
			Helvetica,
			Arial,
			sans-serif,
			"Apple Color Emoji",
			"Segoe UI Emoji",
			"Segoe UI Symbol"
		);
		background-color: var(--surface-ground);
		color: var(--text-color);
		padding: 0;
		margin: 0;
		min-height: 100%;
		-webkit-font-smoothing: antialiased;
	}
</style>
