import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Game from "../pages/Game/Game.vue";
import Transaction from "../pages/Game/Transaction.vue";
import Log from "../pages/Game/Log.vue";
import Bank from "../pages/Game/Bank.vue";
import { getCurrentUser } from "../utils/auth";

export const router = createRouter({
	// 4. Provide the history implementation to use. We are using the hash history for simplicity here.
	history: createWebHashHistory(),
	routes: [
		{ path: "/", component: Home, name: "Home" },
		{ path: "/login", component: Login, name: "Login" },
		{
			path: "/game/:id",
			component: Game,
			name: "Game",
			children: [
				// { path: "/game/:id/transaction", component: Transaction, name: "Transaction" },
				// { path: "/game/:id/log", component: Log, name: "Log" },
				// { path: "/game/:id/bank", component: Bank, name: "Bank" },
			],
		},
	],
});

router.beforeResolve((to, from) => {
	console.log("rout 1");

	if (to.fullPath === "/login") {
		return true;
	}

	if (getCurrentUser() == null) {
		console.log("rout 2");

		router.push("/login");
		console.log("rout 3");
	}

	console.log("rout 4");
});
