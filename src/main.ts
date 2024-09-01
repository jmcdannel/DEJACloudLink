import { createApp } from "vue"
import { VueFire, VueFireAuth } from "vuefire"
import App from "./App.vue"
import { firebaseApp } from "./firebase"
import "./style.css"

const app = createApp(App)
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
})
app.mount("#app")
