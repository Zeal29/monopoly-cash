<script setup lang="ts">
	import { Ref } from "vue";
	import { useLoadLogs } from "../../firebase/logs";
	import { router } from "../../router/router";
	import { Log } from "../../types";
	import { getCurrentUser } from "../../utils/auth";

	const { isLoadingLogs, logs } = defineProps<{ isLoadingLogs: boolean; logs: Log[] }>();

	const currentUser = getCurrentUser();

	function getLogColor(log: Log) {
		if (log.logType === "bankReceive") {
			return "rgb(23, 238, 120)";
		}

		if (log.logType === "bankSend") {
			return "rgb(238, 170, 23)";
		}

		if (log.logType === "bankruptcy") {
			return "red";
		}

		if (currentUser?.userId === log.userId && log.logType === "amountTransfer") {
			return "rgb(221, 48, 100)";
		}

		if (currentUser?.userId === log.toUserId && log.logType === "amountTransfer") {
			return "royalblue";
		}

		return "white";
	}
	function getLogClass(log: Log) {
		if (log.logType === "accuracyPointsUsed") {
			return "accuracyPointsUsed accuracyPoints";
		}

		if (log.logType === "accuracyPointsGained") {
			return "accuracyPointsGained accuracyPoints";
		}
	}
</script>

<template>
	<h1>Logs</h1>

	<ProgressSpinner v-if="isLoadingLogs"></ProgressSpinner>

	<div v-else>
		<div v-for="log in logs" :key="log.logId" class="mt-3">
			<div class="px-3 border" :class="getLogClass(log)" :style="`border-color: ${getLogColor(log)}`">
				<h4 :style="`color: ${getLogColor(log)}`">{{ log.message }}</h4>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.border {
		border: 1px solid white;
	}

	.accuracyPoints {
		border-left: 9px solid !important;
	}
	.accuracyPointsUsed {
		border-left-color: rgb(221, 48, 100) !important;
	}

	.accuracyPointsGained {
		border-left-color: royalblue !important;
	}
</style>
