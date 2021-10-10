import Vue from "vue";
import Vuex from "vuex";
import login from "./login";
import users from "./users";
import vehicles from "./vehicles";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		login,
		users,
		vehicles,
	},
	getters: {
		nav: state => state.nav,
	},
	mutations: {
		disableNavigation(state) {
			state.nav = false;
		},
		enableNavigation(state) {
			state.nav = true;
		},
	},
	namespaced: true,
	state: () => ({
		nav: true,
	}),
});
