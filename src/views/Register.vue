<template>
	<v-form v-model="validForm">
		<v-container class="d-flex justify-center">
			<v-card width="450" class="pa-5 mt-10">
				<v-row justify="center">
					<v-card-text class="text-center">
						<div class="text-center">
							<h1 class="display-2 font-weight-bold mb-2">
								Register
							</h1>
						</div>

						<v-text-field
							v-model="firstName"
							label="First Name..."
							:rules="firstNameRules"
							prepend-icon="mdi-account"
							class="mt-10"
						/>

						<v-text-field
							v-model="lastName"
							label="Last Name..."
							:rules="lastNameRules"
							prepend-icon="mdi-account"
						/>

						<v-text-field
							v-model="email"
							label="Email..."
							:rules="emailRules"
							prepend-icon="mdi-email"
						/>

						<v-text-field
							v-model="password"
							class="mb-8"
							:rules="passwordRules"
							label="Password..."
							prepend-icon="mdi-lock-outline"
						/>

						<v-btn
							:disabled="!validForm"
							color="primary"
							outlined
							elevation="5"
							@click="registerUser"
							>Connexion</v-btn
						>
					</v-card-text>
				</v-row>
			</v-card>
		</v-container>
	</v-form>
</template>

<script>
	import { mapMutations } from "vuex";

	export default {
		name: "Register",
		data: () => ({
			firstName: undefined,
			lastName: undefined,
			email: undefined,
			password: undefined,
			validForm: false,
			emailRules: [
				(v) => !!v || "E-mail is required",
				(v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
			],
			passwordRules: [
				(v) => !!v || "Password is required",
				(v) =>
					(v && v.length >= 8) ||
					"Password must be containt 8 or more characters",
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
		}),
		methods: {
			...mapMutations("login", ["login"]),

			async registerUser() {
				try {
					const { data } = await this.axios.post("users/register", {
						firstName: this.firstName,
						lastName: this.lastName,
						email: this.email,
						password: this.password,
					});

					if (data && data.token) {
						this.login(data.token);
						// this.$socket.emit("new-user", {
						// 	firstName: this.firstName,
						// 	lastName: this.lastName,
						// });

						this.$router.push("/").catch(() => {});
					}
				} catch (error) {
					console.log(error);
				}
			},
		},
	};
</script>
