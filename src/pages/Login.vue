<script setup lang="ts">
	import { ref } from "vue";

	import Password from "primevue/password";
	import { createUser, findUser } from "../firebase/users";
	import { useToast } from "primevue/usetoast";
	import { setCurrentUser } from "../utils/auth";
	import { router } from "../router/router";

	const toast = useToast();
	const username = ref("");
	const passowrd = ref("");

	const loadingLogin = ref(false);
	const loadingCreateAccount = ref(false);

	async function loginHandler() {
		loadingLogin.value = true;

		const user = await findUser(username.value, passowrd.value);
		console.log("user", user);
		loadingLogin.value = false;

		if (user == null) {
			toast.add({ severity: "error", summary: "Login Failed", detail: "Username or Password is worng", life: 3000 });

			return;
		}

		setCurrentUser(user);
		toast.add({ severity: "success", summary: "Logged In", life: 3000 });
		router.push("/");
	}

	async function createAccountHandler() {
		loadingCreateAccount.value = true;
		const user = await findUser(username.value, passowrd.value);

		if (user != null) {
			toast.add({ severity: "info", summary: "Account Already Exist", life: 3000 });
			loadingCreateAccount.value = false;
			return;
		}

		await createUser(username.value, passowrd.value);

		toast.add({ severity: "success", summary: "Account successfully created", life: 3000 });

		loadingCreateAccount.value = false;
	}
</script>

<template>
	<div class="grid grid-nogutter border-1 container">
		<div class="justify-content-center col md:col-6 md:col-offset-3 mx-3 mt-6">
			<Card class="w-full">
				<template #title> Auth </template>
				<template #content>
					<div>
						<div class="grid p-fluid">
							<div class="col-12 md:col-4">
								<div class="p-inputgroup">
									<span class="p-inputgroup-addon">
										<i class="pi pi-user"></i>
									</span>
									<InputText placeholder="Username" v-model="username" />
								</div>
							</div>

							<div class="col-12 md:col-4">
								<div class="p-inputgroup">
									<span class="p-inputgroup-addon">
										<i class="pi pi-lock"></i>
									</span>
									<Password promptLabel="password" placeholder="password" v-model="passowrd" toggleMask />
								</div>
							</div>
						</div>
					</div>
				</template>
				<template #footer>
					<Button icon="pi pi-sign-in" :loading="loadingLogin" :disabled="loadingLogin" label="Login" @click="loginHandler" />
					<Button
						:loading="loadingCreateAccount"
						:disabled="loadingCreateAccount"
						icon="pi pi-user-plus"
						@click="createAccountHandler"
						label="Create Account"
						class="p-button-secondary"
						style="margin-left: 0.5em"
					/>
				</template>
			</Card>
		</div>
	</div>
</template>

<style scoped>
	.container {
		height: 100vh;
	}
</style>
