<script setup lang="ts">
	import { ref } from "vue";
	import { createRoll, useLoadRolls } from "../firebase/dice";
	import { router } from "../router/router";
	import { randomMinMax, sleep } from "../utils/index";
	import { getCurrentUser } from "../utils/auth";
	import { Roll } from "../types/index";

	const gameId = router.currentRoute.value.params.id as string;

	const { isLoadingRolls, rolls } = defineProps<{ isLoadingRolls: boolean; rolls: Roll[] }>();

	// const { isLoadingRolls, rolls } = useLoadRolls(gameId);

	const dice = ref("?");
	const isDiceRolling = ref(false);
	const diceColor = ref("white");

	const nigativeChange = ref(0.1);
	const maxNigative = ref(-5);
	const goldChange = ref(0.05);
	const ultimetChange = ref(0.005);
	const isSettingOpen = ref(false);

	const DiseCooldownComplete = ref(0);

	const rollDice = async () => {
		if (isDiceRolling.value || DiseCooldownComplete.value != 0) return;
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

		const currentUser = getCurrentUser();

		if (currentUser == null) {
			alert("You are not logged in");
			return;
		}

		createRoll(gameId, currentUser.username, currentUser.userId, Number(dice.value));

		DiseCooldownComplete.value = 6;

		while (DiseCooldownComplete.value > 0) {
			DiseCooldownComplete.value--;
			await sleep(1000);
		}
		DiseCooldownComplete.value = 0;
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
	<p v-if="DiseCooldownComplete > 0">Cooldown in {{ DiseCooldownComplete }} seconds</p>

	<div class="">
		<h2>Previous rolls</h2>
		<div v-if="!isLoadingRolls">
			<Card v-for="(roll, index) in rolls" :key="roll.rollId" class="mt-3">
				<template #header>
					<div class="p-2">#{{ index + 1 }}</div>
				</template>
				<template #title>
					{{ roll.username }}
				</template>
				<template #content>
					<div class="">
						<div class="">Roll: {{ roll.value }}</div>
						<div class="mt-2">Time: {{ ((roll.createdAt as any).toDate() as Date).toLocaleString()  }}</div>
					</div>
				</template>
			</Card>
		</div>
		<div class="flex justify-content-center" v-else>
			<ProgressSpinner />
		</div>
	</div>

	<Divider class="my-5" />
	<Button @click="isSettingOpen = !isSettingOpen" label="Settings" class="p-button-text"></Button>

	<div class="my-4">
		<div v-if="isSettingOpen">
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
