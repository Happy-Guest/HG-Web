import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import { useStyleStore } from "@/stores/style.js";
import { darkModeKey, styleKey } from "@/config.js";

import "./css/main.css";

/* Init Pinia */
const pinia = createPinia();

/* Create Vue app */
const app = createApp(App);
const serverUrl = import.meta.env.VITE_SERVER_URL;

app.provide(
    "axios",
    axios.create({
        baseURL: serverUrl + "/api",
        headers: {
            "Content-Type": "application/json",
        },
    })
);

app.use(router).use(pinia);
app.mount("#app");

/* Init Pinia stores */
const styleStore = useStyleStore(pinia);

/* App style */
styleStore.setStyle(localStorage[styleKey] ?? "basic");

/* Dark mode */
if (
    (!localStorage[darkModeKey] &&
        window.matchMedia("(prefers-color-scheme: dark)").matches) ||
    localStorage[darkModeKey] === "1"
) {
    styleStore.setDarkMode(true);
}

/* Default title tag */
const defaultDocumentTitle = "HappyGuest";

/* Set document title from route meta */
router.afterEach((to) => {
    document.title = to.meta?.title
        ? `${to.meta.title} — ${defaultDocumentTitle}`
        : defaultDocumentTitle;
});
