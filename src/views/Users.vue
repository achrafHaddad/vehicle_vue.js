<template>
	<v-container v-if="profile && profile.role === 'admin'">
		<v-data-table
			:headers="headers"
			:items="usersList"
			sort-by="createdAt"
			class="elevation-1"
		>
			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>Users List</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
					<v-spacer></v-spacer>
					<v-dialog
						v-model="userDialog"
						@click:outside="closeUserForm"
						max-width="700px"
					>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								color="primary"
								dark
								class="mb-2"
								v-bind="attrs"
								v-on="on"
								@click="
									setUserDialog(true);
									setNewUser(true);
								"
							>
								New User
							</v-btn>
						</template>
						<user-data :index="editedIndex" />
					</v-dialog>
					<v-dialog v-model="dialogBan" max-width="550px">
						<v-card>
							<v-card-title class="text-h5">
								{{ banTitle }}
							</v-card-title>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn
									color="blue darken-1"
									text
									@click="closeBan"
									>Cancel</v-btn
								>
								<v-btn
									color="red darken-1"
									text
									@click="banUserConfirm"
									>OK</v-btn
								>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:item.createdAt="{ item }">
				{{ item.createdAt | moment("D M YYYY, h:mm a") }}
			</template>
			<template v-slot:item.role="{ item }">
				{{ item.role === "admin" ? "Administrator" : "User" }}
			</template>
			<template v-slot:item.actions="{ item }">
				<v-icon small class="mr-2" @click="editItem(item)">
					mdi-pencil
				</v-icon>
				<v-icon
					v-if="profile.role === 'admin'"
					small
					class="mr-2"
					@click="viewVehicles(item)"
				>
					mdi-car
				</v-icon>
				<span v-if="item._id != profile._id">
					<v-icon
						v-if="item.accountStatus === 'Active'"
						small
						@click="banUser(item)"
					>
						mdi-account-lock
					</v-icon>
					<v-icon v-else small @click="banUser(item)">
						mdi-account-check
					</v-icon>
				</span>
			</template>
		</v-data-table>
	</v-container>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";
	import UserData from "../components/users/UserData.vue";

	export default {
		components: {
			UserData,
		},
		data: () => ({
			dialog: false,
			dialogBan: false,
			headers: [
				{
					text: "First Name",
					align: "start",
					value: "firstName",
				},
				{
					text: "Last Name",
					align: "start",
					value: "lastName",
				},
				{ text: "Email", value: "email" },
				{ text: "Role", value: "role" },
				{ text: "Join Date", value: "createdAt" },
				{ text: "Actions", value: "actions", sortable: false },
			],
			usersList: [],
			editedIndex: -1,
			editedItem: {
				firstName: "",
				lastName: 0,
				email: 0,
				role: "user",
				createdAt: new Date(),
			},
			defaultItem: {
				firstName: "",
				lastName: 0,
				email: 0,
				role: "user",
				createdAt: new Date(),
			},
		}),
		computed: {
			...mapGetters("users", ["profile", "users", "userDialog"]),

			formTitle() {
				return this.editedIndex === -1 ? "New User" : "Edit User";
			},
			banTitle() {
				return this.editedItem.accountStatus === "Banned"
					? "Are you sure you want to Activate this user?"
					: "Are you sure you want to Ban this user?";
			},
		},
		watch: {
			dialog(val) {
				val || this.close();
			},
			dialogBan(val) {
				val || this.closeBan();
			},
		},
		async created() {
			!this.users.length && (await this.setUsers());
			this.usersList = this.users;
		},
		methods: {
			...mapActions("users", ["setUsers"]),
			...mapMutations("users", [
				"setEditUser",
				"setUserDialog",
				"setBanUser",
				"setNewUser",
			]),

			editItem(item) {
				this.editedIndex = this.usersList.indexOf(item);
				this.editedItem = Object.assign({}, item);
				this.setEditUser(this.editedItem);
				this.setUserDialog(true);
				this.dialog = true;
			},
			viewVehicles(item) {
				this.$router.push({ name: "vehicles", query: { id: item._id } });
			},
			banUser(item) {
				this.editedIndex = this.usersList.indexOf(item);
				this.editedItem = Object.assign({}, item);
				this.dialogBan = true;
			},
			async banUserConfirm() {
				const item = this.usersList[this.editedIndex];
				try {
					await this.axios.delete(`users/ban-user/${item._id}`);
					this.setBanUser(this.editedIndex);
				} catch (error) {
					console.error("Failed to delete user");
				}
				this.closeBan();
			},
			closeBan() {
				this.dialogBan = false;
				this.$nextTick(() => {
					this.editedItem = Object.assign({}, this.defaultItem);
					this.editedIndex = -1;
				});
			},
			closeUserForm() {
				this.setUserDialog(false);
				this.setNewUser(false);
			},
		},
	};
</script>