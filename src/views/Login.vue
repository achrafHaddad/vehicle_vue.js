<template>
	<v-form v-model="validForm">
		<v-container class="d-flex justify-center">
			<v-card width="450" class="pa-5 mt-10">
				<v-row justify="center">
					<v-card-text class="text-center">
						<div class="text-center">
							<h1 class="display-2 font-weight-bold mb-2">
								Login
							</h1>
						</div>
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
							@click="loginUser"
							>Connexion</v-btn
						>
						<span class="mx-2">Or</span>
						<v-btn
							color="primary"
							outlined
							elevation="5"
							:to="{ name: 'register' }"
							>Register</v-btn
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
		name: "Login",
		data: () => ({
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
		}),
		methods: {
			...mapMutations("login", ["login"]),

			async loginUser() {
				try {
					const { data } = await this.axios.post("users/login", {
						email: this.email,
						password: this.password,
					});

					if (data && data.token) {
						this.login(data.token);

						this.$router.push("/").catch(() => {});
					}
				} catch (error) {
					console.log(error);
				}
			},
		},
	};
</script>
