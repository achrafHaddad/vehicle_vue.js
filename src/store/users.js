import axios from "axios";

export default {
	namespaced: true,
	state: () => ({
		users: [],
		profile: {},
		editUser: {},
		userDialog: false,
		newUser: false,
	}),
	mutations: {
		addUser(state, user) {
			state.users.push(user);
		},
		setProfile(state, profile) {
			state.profile = profile;
		},
		setEditUser(state, user) {
			state.editUser = user;
		},
		setUserDialog(state, payload) {
			state.userDialog = payload;
		},
		setNewUser(state, payload) {
			state.newUser = payload;
		},
		setBanUser(state, payload) {
			const status = state.users[payload].accountStatus === "Active" ? "Banned" : "Active";
			state.users[payload].accountStatus = status;
		},
		updateUserInList(state, user) {
			const index = state.users.findIndex(item => item._id == user._id);
			state.users[index].firstName = user.firstName;
			state.users[index].lastName = user.lastName;
			state.users[index].email = user.email;
			state.users[index].phone = user.phone;
			state.users[index].avatar = user.avatar;
			state.users[index].address = user.address;
			state.users[index].role = user.role;
		},

		clear(state) {
			state.users = [];
			state.profile = {};
			state.editUser = {};
			state.userDialog = false;
			state.newUser = false;
		},
	},
	actions: {
		async setUsers({ state }) {
			try {
				const { data } = await axios.get("users");

				state.users = data;
			} catch (error) {
				console.error("Failed to fetch users");
			}
		},
		async getProfile({ commit }) {
			try {
				const { data } = await axios.get("users/profile");
				commit("setProfile", data);
			} catch (error) {
				console.error("Failed to fetch user");
			}
		},
	},
	getters: {
		users: state => state.users,
		profile: state => state.profile,
		editUser: state => state.editUser,
		userDialog: state => state.userDialog,
		newUser: state => state.newUser,
	},
};
