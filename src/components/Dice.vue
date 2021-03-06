<script setup lang="ts">
	import { ref } from "vue";
	import { createRoll, setCurrentUserTurn, useLoadRolls } from "../firebase/dice";
	import { router } from "../router/router";
	import { randomMinMax, sleep } from "../utils/index";
	import { getCurrentUser } from "../utils/auth";
	import { Player, Roll } from "../types/index";
	import Slider from "primevue/slider";
	import { debug } from "console";
	import { acquireAccuracyPoints, spendAccuracyPoints } from "../firebase/player";

	const gameId = router.currentRoute.value.params.id as string;

	const props = defineProps<{
		isLoadingRolls: boolean;
		rolls: Roll[];
		isMyTurn: boolean;
		currentTurnPlayer: Player;
		players: Player[];
		myPlayer: Player | null;
	}>();

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

	const accuracyRollNumber = ref<number>(1);

	const accuracyPoints = ref(0);

	const rollDice = async () => {
		if (!props.isMyTurn) return;
		if (isDiceRolling.value || DiseCooldownComplete.value != 0 || props.myPlayer == null) return;
		diceColor.value = "white";

		isDiceRolling.value = true;

		for (let i = 0; i < randomMinMax(10, 40); i++) {
			dice.value = generateNumber();

			await sleep(randomMinMax(10, 320));
		}

		isDiceRolling.value = false;

		if (dice.value === "☄️") {
			diceColor.value = "red";
			isDiceRolling.value = true;

			await sleep(5000);

			for (let i = 0; i < randomMinMax(10, 40); i++) {
				dice.value = randomMinMax(50, 100).toString();

				await sleep(randomMinMax(10, 320));
			}

			isDiceRolling.value = false;
		}

		if (dice.value === "🌟") {
			diceColor.value = "gold";
			await sleep(3000);
			isDiceRolling.value = true;

			for (let i = 0; i < randomMinMax(10, 40); i++) {
				dice.value = calculateGoldenChance();

				await sleep(randomMinMax(10, 320));
			}

			isDiceRolling.value = false;
		}

		if (dice.value == "☠️") {
			diceColor.value = "#6200ff";
			isDiceRolling.value = true;

			await sleep(3000);

			for (let i = 0; i < randomMinMax(10, 40); i++) {
				dice.value = randomMinMax(maxNigative.value, -1).toString();

				await sleep(randomMinMax(10, 320));
			}

			isDiceRolling.value = false;
		}

		if (dice.value === "🎯") {
			diceColor.value = "#f12f63";
			isDiceRolling.value = true;

			spendAccuracyPoints(gameId, props.myPlayer?.playerId, accuracyPoints.value);
			await sleep(3000);

			isDiceRolling.value = false;

			dice.value = accuracyRollNumber.value.toString();
		} else {
			acquireAccuracyPoints(gameId, props.myPlayer?.playerId, 5);
		}

		const currentUser = getCurrentUser();

		if (currentUser == null) {
			alert("You are not logged in");
			return;
		}

		createRoll(gameId, currentUser.username, currentUser.userId, Number(dice.value));

		DiseCooldownComplete.value = 6;

		nextUserTurn();

		while (DiseCooldownComplete.value > 0) {
			DiseCooldownComplete.value--;
			await sleep(1000);
		}
		DiseCooldownComplete.value = 0;
	};

	function generateNumber() {
		let accuracyDiceChange = Math.random();

		debugger;
		let accuracyChance = accuracyPoints.value / 100;

		if (accuracyDiceChange <= accuracyChance) {
			return "🎯";
		}

		let diceChange = Math.random();

		let chance = ultimetChange.value;

		if (diceChange <= chance) {
			return "☄️";
		}

		chance += goldChange.value;

		if (diceChange <= chance) {
			return "🌟";
		}

		chance += nigativeChange.value;

		if (diceChange <= chance) {
			return "☠️";
		}

		return randomMinMax(0, 12).toString();
	}

	function calculateGoldenChance() {
		return randomMinMax(13, 24).toString();
	}

	async function nextUserTurn() {
		debugger;
		if (props.currentTurnPlayer == null) return;

		const playerList = props.players.filter((p) => p.userId !== "bank");

		let nextPlayerIdx =
			playerList.sort((a, b) => a.playOrder - b.playOrder).findIndex((player) => player.userId === props.currentTurnPlayer.userId) + 1;

		if (nextPlayerIdx >= playerList.length) {
			nextPlayerIdx = 0;
		}

		await setCurrentUserTurn(gameId, playerList[nextPlayerIdx].userId);
	}
</script>

<template>
	<h1>Dice</h1>

	<div class="">
		<div class="">
			<h2>Total Accuracy Points : {{ props.myPlayer?.accuracyPoints ?? "?" }}</h2>
		</div>
		<div class="">
			<h4>Roll Value : {{ accuracyRollNumber }}</h4>
			<Slider v-model="accuracyRollNumber" :step="1" :min="1" :max="10" />
		</div>
		<div class="">
			<h4>Accuracy Points : {{ accuracyPoints }}</h4>
			<Slider v-model="accuracyPoints" :step="5" :min="0" :max="props.myPlayer?.accuracyPoints ?? 0" />
		</div>
	</div>

	<div class="flex justify-content-center h-20rem flex align-items-center">
		<div class="flex align-items-center flex-column">
			<div
				@click="rollDice"
				:style="`color: ${diceColor}; border-color: ${diceColor}`"
				:class="{ diceDisabled: !isMyTurn }"
				class="dice relative h-12rem w-12rem flex justify-content-center align-items-center diceFont"
			>
				<ProgressSpinner v-if="isDiceRolling" class="h-12rem w-12rem absolute"> </ProgressSpinner>
				{{ dice }}
			</div>
		</div>
	</div>
	<p v-if="DiseCooldownComplete > 0">Cooldown in {{ DiseCooldownComplete }} seconds</p>
	<p v-if="!isMyTurn">This is Not You turn yet</p>

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

	.diceDisabled {
		opacity: 0.6;
	}
</style>
