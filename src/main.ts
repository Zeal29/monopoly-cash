import { createApp } from "vue";
import App from "./App.vue";
import { setupPrimeVue } from "./primeVue";
import { router } from "./router/router";

const app = createApp(App);

setupPrimeVue(app);

app.use(router);
app.mount("#app");
