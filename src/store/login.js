const parsePayload = token => {
	const [_header, payload] = token.split(".");
	const parsedPayload = atob(payload);

	try {
		return JSON.parse(parsedPayload);
	} catch (err) {
		return null;
	}
};

export default {
	namespaced: true,
	state: () => ({
		token: undefined,
		role: undefined,
	}),
	mutations: {
		login(state, token) {
			state.token = token;
			localStorage.setItem("token", token);
		},

		clear(state) {
			state.token = undefined;
			localStorage.removeItem("token");
		},
	},
	actions: {
		logout({ commit }) {
			commit("clear");
			commit("users/clear", null, { root: true });
			commit("vehicles/clear", null, { root: true });
		},
		async setToken({ state }) {
			state.token = localStorage.getItem("token") || undefined;
			const { role } = state.token ? parsePayload(state.token) : {};
			state.role = role;
		},
	},
	getters: {
		isAuthenticated: state => !!state.token,
		isAdmin: state => state.role === "admin",
	},
};
