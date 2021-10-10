import axios from "axios";

export default {
	namespaced: true,
	state: () => ({
		vehicles: [],
		vehicle: {},
	}),
	mutations: {
		addVehicle(state, vehicle) {
			state.vehicles.push(vehicle);
		},
		viewVehicle(state, vehicle) {
			const item = state.vehicles.find(veh => veh._id == vehicle._id);
			state.vehicle = item;
		},
		setVehicleStatus(state, vehicle) {
			const index = state.vehicles.findIndex(item => item._id == vehicle._id);
			const status = state.vehicles[index].status === "Active" ? "Deleted" : "Active";
			state.vehicles[index].status = status;
		},
		updateVehicleInList(state, vehicle) {
			const index = state.vehicles.findIndex(item => item._id == vehicle._id);
			state.vehicles[index].name = vehicle.name;
			state.vehicles[index].model = vehicle.model;
			state.vehicles[index].licensePlate = vehicle.licensePlate;
		},

		clear(state) {
			state.vehicles = [];
			state.vehicle = {};
		},
	},
	actions: {
		async getVehicles({ state }, userId) {
			try {
				const url = userId ? `vehicles/?id=${userId}` : "vehicles";
				const { data } = await axios.get(url);

				state.vehicles = data;
			} catch (error) {
				console.error("Failed to fetch vehicles");
			}
		},
		async setVehicle({ commit }) {
			try {
				const { data } = await axios.post("vehicles");
				commit("addVehicle", data);
			} catch (error) {
				console.error("Failed to set vehicle");
			}
		},
	},
	getters: {
		vehicles: state => state.vehicles,
		vehicle: state => state.vehicle,
	},
};
