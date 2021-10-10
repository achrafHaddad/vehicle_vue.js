<template>
	<v-container>
		<v-data-table
			:headers="headers"
			:items="vehiclesList"
			sort-by="calories"
			class="elevation-1"
		>
			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>Vehicles List</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
					<v-spacer></v-spacer>
					<v-dialog v-model="dialog" max-width="500px">
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								color="primary"
								dark
								class="mb-2"
								v-bind="attrs"
								v-on="on"
							>
								New Vehicle
							</v-btn>
						</template>
						<v-card>
							<v-card-title>
								<span class="text-h5">{{ formTitle }}</span>
							</v-card-title>

							<v-card-text>
								<v-container>
									<v-row>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.name"
												label="Vehicle name"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.model"
												label="Model"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="
													editedItem.licensePlate
												"
												label="License plate"
											></v-text-field>
										</v-col>
									</v-row>
								</v-container>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn
									color="blue darken-1"
									text
									@click="close"
								>
									Cancel
								</v-btn>
								<v-btn color="blue darken-1" text @click="save">
									Save
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
					<v-dialog v-model="dialogDelete" max-width="550px">
						<v-card>
							<v-card-title class="text-h5">
								{{ deleteTitle }}
							</v-card-title>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn
									color="blue darken-1"
									text
									@click="closeDelete"
									>Cancel</v-btn
								>
								<v-btn
									color="red darken-1"
									text
									@click="deleteItemConfirm"
									>OK</v-btn
								>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:item.createdAt="{ item }">
				{{ item.createdAt | moment("dddd, D MM YY, h:mm a") }}
			</template>
			<template v-slot:item.actions="{ item }">
				<v-icon small class="mr-2" @click="editItem(item)">
					mdi-pencil
				</v-icon>
				<v-icon
					v-if="item.status === 'Active'"
					small
					@click="deleteItem(item)"
				>
					mdi-delete
				</v-icon>
				<v-icon
					v-if="profile.role === 'admin' && item.status === 'Deleted'"
					small
					@click="deleteItem(item)"
				>
					mdi-restore
				</v-icon>
			</template>
		</v-data-table>
	</v-container>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";
	export default {
		data: () => ({
			dialog: false,
			dialogDelete: false,
			headers: [
				{
					text: "Name",
					align: "start",
					value: "name",
				},
				{ text: "Model", value: "model" },
				{ text: "License plate", value: "licensePlate" },
				{ text: "Created Date", value: "createdAt" },
				{ text: "Actions", value: "actions", sortable: false },
			],
			vehiclesList: [],
			editedIndex: -1,
			editedItem: {
				name: "",
				model: 0,
				licensePlate: 0,
				createdAt: new Date(),
			},
			defaultItem: {
				name: "",
				model: 0,
				licensePlate: 0,
				createdAt: new Date(),
			},
		}),
		computed: {
			...mapGetters("vehicles", ["vehicles", "vehicle"]),
			...mapGetters("users", ["profile"]),

			formTitle() {
				return this.editedIndex === -1 ? "New Vehicle" : "Edit Vehicle";
			},
			deleteTitle() {
				return this.editedItem.status === "Active"
					? "Are you sure you want to delete this vehicle?"
					: "Are you sure you want to restore this vehicle?";
			},
		},
		watch: {
			dialog(val) {
				val || this.close();
			},
			dialogDelete(val) {
				val || this.closeDelete();
			},
			"$route.query.id": {
				async handler(id, oldId) {
					if (!id && oldId && oldId != this.profile._id) {
						await this.getVehicles();

						this.setList();
					}
				},
				deep: true,
				immediate: true,
			},
		},
		async created() {
			const userId = this.$route.query.id;
			if (this.vehicles.length && this.vehicles[0].userId != userId)
				await this.getVehicles(userId);
			else await this.getVehicles(userId ? userId : null);

			this.setList();
		},
		methods: {
			...mapActions("vehicles", ["getVehicles"]),
			...mapMutations("vehicles", [
				"viewVehicle",
				"addVehicle",
				"updateVehicleInList",
				"setVehicleStatus",
			]),

			setList() {
				this.vehiclesList =
					this.profile.role === "admin"
						? this.vehicles
						: this.vehicles.filter((item) => item.status !== "Deleted");
			},
			editItem(item) {
				this.editedIndex = this.vehiclesList.indexOf(item);
				this.editedItem = Object.assign({}, item);
				this.dialog = true;
			},
			deleteItem(item) {
				this.editedIndex = this.vehiclesList.indexOf(item);
				this.editedItem = Object.assign({}, item);
				this.dialogDelete = true;
			},
			async deleteItemConfirm() {
				const item = this.vehiclesList[this.editedIndex];
				const url =
					this.profile.role === "admin"
						? `vehicles/${item._id}/?id=${item.userId}`
						: `vehicles/${item._id}`;
				try {
					const {
						data: { vehicle },
					} = await this.axios.delete(url);

					this.setVehicleStatus(vehicle);
				} catch (error) {
					console.error("Failed to delete vehicle");
				}
				this.profile.role === "user" &&
					this.vehiclesList.splice(this.editedIndex, 1);
				this.closeDelete();
			},
			close() {
				this.dialog = false;
				this.$nextTick(() => {
					this.editedItem = Object.assign({}, this.defaultItem);
					this.editedIndex = -1;
				});
			},
			closeDelete() {
				this.dialogDelete = false;
				this.$nextTick(() => {
					this.editedItem = Object.assign({}, this.defaultItem);
					this.editedIndex = -1;
				});
			},
			async save() {
				const userId = this.$route.query.id;

				if (this.editedIndex > -1) {
					const item = this.vehiclesList[this.editedIndex];
					const url = userId
						? `vehicles/${item._id}/?id=${userId}`
						: `vehicles/${item._id}`;

					try {
						const {
							data: { vehicle },
						} = await this.axios.put(url, {
							name: this.editedItem.name,
							model: this.editedItem.model,
							licensePlate: this.editedItem.licensePlate,
						});
						this.updateVehicleInList(vehicle);
						this.close();
					} catch (error) {
						console.error("Failed to update vehicle");
					}
				} else {
					const url = userId ? `vehicles/?id=${userId}` : "vehicles";

					try {
						const {
							data: { vehicle },
						} = await this.axios.post(url, {
							name: this.editedItem.name,
							model: this.editedItem.model,
							licensePlate: this.editedItem.licensePlate,
						});

						this.addVehicle(vehicle);
						this.close();
					} catch (error) {
						console.error("Failed to set vehicle");
					}
				}
			},
		},
	};
</script>