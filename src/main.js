import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";

const baseURL = `${process.env.VUE_APP_VEHICLES_MANAGEMENT_API}/`;

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(require("vue-moment"));

axios.defaults.baseURL = baseURL;

axios.interceptors.request.use(config => {
	config.headers.Authorization = `Bearer ${store.state.login.token}`;
	return config;
});

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App),
}).$mount("#app");
