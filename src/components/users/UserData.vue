<template>
	<v-card class="px-2 pt-2">
		<v-form ref="form" v-model="valid" class="pa-3">
			<v-row>
				<v-col cols="3">
					<v-card link class="pa-2" width="100%" height="150">
						<v-img
							contain
							width="100%"
							height="100%"
							:src="user.avatar || defaultAvatar"
							@click="$refs.fileInput.$refs.input.click()"
						/>
					</v-card>

					<v-file-input
						ref="fileInput"
						v-model="file"
						class="d-none"
						id="avatar"
						name="avatar"
						accept="image/png, image/jpeg, image/svg+xml"
						:loading="loading"
						@change="uploadFile"
					/>
				</v-col>

				<v-col>
					<v-row>
						<v-col class="pb-0">
							<v-text-field
								v-model="user.firstName"
								dense
								filled
								outlined
								:rules="firstNameRules"
								label="First name"
							/>
						</v-col>

						<v-col class="pb-0">
							<v-text-field
								v-model="user.lastName"
								dense
								filled
								:rules="lastNameRules"
								outlined
								label="Last name"
							/>
						</v-col>
					</v-row>
					<v-row>
						<v-col class="py-0">
							<v-text-field
								v-model="user.email"
								dense
								filled
								:rules="emailRules"
								outlined
								label="Email"
							/>
						</v-col>

						<v-col class="py-0">
							<v-text-field
								v-model="user.phone"
								dense
								filled
								outlined
								label="Phone"
							/>
						</v-col>
					</v-row>
					<v-row>
						<v-col class="py-0">
							<v-text-field
								v-model="user.address"
								dense
								filled
								outlined
								label="Address"
							/>
						</v-col>
						<v-col v-if="profile.role === 'admin'" class="py-0">
							<v-select
								v-model="user.role"
								label="Roles"
								outlined
								item-text="name"
								item-value="value"
								:items="roles"
							/>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-form>

		<v-divider />

		<v-card-actions>
			<v-spacer />

			<v-btn
				v-if="profile.role === 'admin'"
				class="mb-5 mr-7"
				:class="{ 'mr-10': $vuetify.breakpoint.sm }"
				color="secondary"
				@click="close"
			>
				close
			</v-btn>

			<v-btn
				class="mb-5 mr-0"
				color="primary"
				:disabled="!valid"
				@click="save"
			>
				save
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
	import { mapActions, mapGetters, mapMutations } from "vuex";
	export default {
		data: () => ({
			valid: false,
			file: undefined,
			emailRules: [
				(v) => !!v || "E-mail is required",
				(v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
			],
			firstNameRules: [
				(v) => !!v || "FirstName is required",
				(v) =>
					(v && v.length >= 3) ||
					"FirstName must be containt 3 or more characters",
			],
			lastNameRules: [
				(v) => !!v || "LastName is required",
				(v) =>
					(v && v.length >= 3) ||
					"LastName must be containt 3 or more characters",
			],
			user: {
				firstName: undefined,
				lastName: undefined,
				email: undefined,
				phone: undefined,
				address: undefined,
				avatar: undefined,
				role: "user",
			},
			defaultUser: {
				firstName: undefined,
				lastName: undefined,
				email: undefined,
				phone: undefined,
				address: undefined,
				avatar: undefined,
				role: "user",
			},
			roles: [
				{ name: "User", value: "user" },
				{ name: "Administrator", value: "admin" },
			],
			defaultAvatar: undefined,
			loading: false,
		}),
		computed: {
			...mapGetters("users", [
				"profile",
				"editUser",
				"newUser",
				"userDialog",
			]),
		},
		watch: {
			editUser: {
				handler(val) {
					this.user = val;
				},
				deep: true,
			},
			newUser(val) {
				if (val) this.user.role = this.defaultUser.role;
			},
			userDialog(val) {
				if (!val) this.$refs.form.reset();
			},
		},
		async mounted() {
			!Object.keys(this.profile).length && (await this.getProfile());
			this.defaultAvatar = require("@/assets/logo.svg");
			this.populateForm();
			if (this.newUser) this.user = this.defaultUser;
		},
		methods: {
			...mapActions("users", ["getProfile"]),
			...mapMutations("users", [
				"setUserDialog",
				"setNewUser",
				"addUser",
				"updateUserInList",
			]),

			populateForm() {
				const user =
					this.profile.role === "admin" ? this.editUser : this.profile;
				this.user.email = user.email;
				this.user.firstName = user.firstName;
				this.user.lastName = user.lastName;
				this.user.address = user.address;
				this.user.avatar = user.avatar;
				this.user.phone = user.phone;
				this.user.role = user.role;
			},
			uploadFile() {
				const reader = new FileReader();

				if (this.file) {
					reader.onload = () => {
						this.user.avatar = reader.result;
					};
					reader.readAsDataURL(this.file);
				}
			},
			async save() {
				try {
					if (this.profile._id && !this.newUser) {
						const formData = new FormData();

						formData.append("avatar", this.file);
						formData.append("email", this.user.email);
						formData.append("firstName", this.user.firstName);
						formData.append("lastName", this.user.lastName);
						formData.append("address", this.user.address);
						formData.append("phone", this.user.phone);
						formData.append("role", this.user.role);

						const url =
							this.profile.role === "admin"
								? `users/?id=${this.editUser._id}`
								: "users";

						const {
							data: { updatedUser: user },
						} = await this.axios.put(url, formData);

						this.profile.role === "admin" &&
							this.updateUserInList(user);
					} else {
						const {
							data: { user },
						} = await this.axios.post("users", {
							email: this.user.email,
							firstName: this.user.firstName,
							lastName: this.user.lastName,
							address: this.user.address,
							avatar: this.user.avatar,
							phone: this.user.phone,
							role: this.user.role,
						});
						this.addUser(user);
					}
					this.setUserDialog(false);
					this.setNewUser(false);
				} catch (error) {
					console.log(error);
				}
			},
			close() {
				this.setUserDialog(false);
			},
		},
	};
</script>