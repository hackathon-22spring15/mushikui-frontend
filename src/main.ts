import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueCookie from "vue3-cookies";
import Toast, { PluginOptions, POSITION, TYPE } from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(router);
app.use(VueCookie);

const options: PluginOptions = {
  transition: "Vue-Toastification__fade",
  maxToasts: 3,
  newestOnTop: true,
  toastDefaults: {
    [TYPE.ERROR]: {
        timeout: 50000,
        position: POSITION.TOP_CENTER,
        closeOnClick: false,
        pauseOnFocusLoss: true,
        draggable: false,
        hideProgressBar: true,
        closeButton: false,
        icon: false,
    },
  },
};
app.use(Toast, options);

app.mount("#app");
