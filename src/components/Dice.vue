<script setup lang="ts">
	import { ref } from "vue";
	import { randomMinMax, sleep } from "../utils/index";

	const dice = ref("?");
	const isDiceRolling = ref(false);
	const diceColor = ref("white");

	const nigativeChange = ref(0.1);
	const maxNigative = ref(-5);
	const goldChange = ref(0.05);
	const ultimetChange = ref(0.005);
	const isSettingOpen = ref(false);

	const rollDice = async () => {
		diceColor.value = "white";

		isDiceRolling.value = true;

		for (let i = 0; i < randomMinMax(10, 40); i++) {
			dice.value = generateNumber();

			await sleep(randomMinMax(10, 320));
		}

		isDiceRolling.value = false;

		if (dice.value === "☄️") {
			isDiceRolling.value = true;
			diceColor.value = "red";
			await sleep(5000);

			for (let i = 0; i < randomMinMax(10, 40); i++) {
				dice.value = randomMinMax(50, 100).toString();

				await sleep(randomMinMax(10, 320));
			}

			isDiceRolling.value = false;
		}

		if (dice.value === "🌟") {
			isDiceRolling.value = true;
			diceColor.value = "gold";
			await sleep(3000);

			for (let i = 0; i < randomMinMax(10, 40); i++) {
				dice.value = calculateGoldenChance();

				await sleep(randomMinMax(10, 320));
			}

			isDiceRolling.value = false;
		}

		if (dice.value == "☠️") {
			isDiceRolling.value = true;
			diceColor.value = "#6200ff";
			await sleep(3000);

			for (let i = 0; i < randomMinMax(10, 40); i++) {
				dice.value = randomMinMax(maxNigative.value, -1).toString();

				await sleep(randomMinMax(10, 320));
			}

			isDiceRolling.value = false;
		}
	};

	function generateNumber() {
		const diceChange = Math.random();

		if (diceChange <= ultimetChange.value) {
			return "☄️";
		}

		if (diceChange <= goldChange.value) {
			return "🌟";
		}

		if (diceChange < nigativeChange.value) {
			return "☠️";
		}

		return randomMinMax(0, 12).toString();
	}

	function calculateGoldenChance() {
		return randomMinMax(13, 24).toString();
	}
</script>

<template>
	<h1>Dice</h1>

	<div class="flex justify-content-center h-20rem flex align-items-center">
		<div class="flex align-items-center flex-column">
			<div
				@click="rollDice"
				:style="`color: ${diceColor}; border-color: ${diceColor}`"
				class="dice relative h-12rem w-12rem flex justify-content-center align-items-center diceFont"
			>
				<ProgressSpinner v-if="isDiceRolling" class="h-12rem w-12rem absolute"> </ProgressSpinner>
				{{ dice }}
			</div>
		</div>
	</div>

	<Button @click="isSettingOpen = !isSettingOpen" label="settings"></Button>

	<div v-if="isSettingOpen" class="my-4">
		<div class="p-fluid grid">
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<InputNumber id="maxNegative" v-model="maxNigative" />
					<label for="maxNegative">Max Negative</label>
				</span>
			</div>
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<InputNumber id="negativeChance" v-model="nigativeChange" />
					<label for="negativeChance">Negative Chance</label>
				</span>
			</div>
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<InputNumber id="goldChange" v-model="goldChange" />
					<label for="goldChange">Gold Chance</label>
				</span>
			</div>
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<InputNumber id="ultimetChange" v-model="ultimetChange" />
					<label for="ultimetChange">Ultimet Change</label>
				</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.diceFont {
		font-size: 5rem;
	}

	.dice {
		border: 5px solid white;
		border-radius: 29px;
	}
</style>
