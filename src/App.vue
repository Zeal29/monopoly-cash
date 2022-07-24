<script setup lang="ts"></script>

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
