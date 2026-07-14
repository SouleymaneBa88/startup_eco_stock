import { createApp } from "vue";
import { createRouter } from "vue-router";
import App from "./App.vue";
import router from "./router";


import * as Sentry from "@sentry/vue";

import LogRocket from 'logrocket'
LogRocket.init('pat:r0pvox:eco-stock:zr7fLuqJRro693_EeXMkjrkof5JPn5cC_gFPkhqjMzI')
const app = createApp({App});

Sentry.init({
  app,
  dsn: "https://4e483ee6c6c154ebb61eca107c86708a@o4511713491025920.ingest.de.sentry.io/4511733049655376",
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: []
  }
});

app.use(router);
app.mount("#app");