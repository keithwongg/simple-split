import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { ToastService } from "primevue";
import { ConfirmationService } from "primevue";

const app = createApp(App);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(ToastService)
app.use(ConfirmationService)
app.mount("#app");
