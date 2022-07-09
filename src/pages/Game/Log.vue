<script setup lang="ts">
	import { Ref } from "vue";
	import { useLoadLogs } from "../../firebase/logs";
	import { router } from "../../router/router";
	import { Log } from "../../types";
	import { getCurrentUser } from "../../utils/auth";

	const { isLoadingLogs, logs } = defineProps<{ isLoadingLogs: boolean; logs: Log[] }>();

	// const gameId = router.currentRoute.value.params.id as string;
	// const { isLoadingLogs, logs } = useLoadLogs(gameId);

	const currentUser = getCurrentUser();

	function getLogColor(log: Log) {
		if (log.logType === "bankReceive") {
			return "green";
		}

		if (log.logType === "bankSend") {
			return "yellow";
		}

		if (log.logType === "bankruptcy") {
			return "red";
		}

		if (currentUser?.userId === log.userId) {
			return "pink";
		}

		if (currentUser?.userId === log.toUserId) {
			return "royalblue";
		}
	}
</script>

<template>
	<h1>Logs</h1>

	<ProgressSpinner v-if="isLoadingLogs"></ProgressSpinner>

	<div v-else>
		<div v-for="log in logs" :key="log.logId" class="mt-3">
			<div class="border-1 px-3" :style="`border-color: ${getLogColor(log)}`">
				<h4 :style="`color: ${getLogColor(log)}`">{{ log.message }}</h4>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
