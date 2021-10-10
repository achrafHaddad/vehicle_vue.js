<template>
	<v-sheet>
		<v-app-bar color="indigo darken-4" dark>
			<v-toolbar-title>Vehicle Management</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-btn :to="{ name: 'vehicles' }" text>
				<span class="mr-2">Vehicles</span>
			</v-btn>
			<v-btn :to="{ name: 'users' }" exact text>
				<span class="mr-2">Users</span>
			</v-btn>
			<v-btn @click="logoutFromApp" text>
				<span class="mr-2">Logout</span>
			</v-btn>
		</v-app-bar>
	</v-sheet>
</template>

<script>
	import { mapActions, mapGetters } from "vuex";
	export default {
		computed: {
			...mapGetters("users", ["profile"]),
		},
		async created() {
			!Object.keys(this.profile).length && (await this.getProfile());
		},
		methods: {
			...mapActions("login", ["logout"]),
			...mapActions("users", ["getProfile"]),

			logoutFromApp() {
				this.logout();
				this.$router.replace("/login");
			},
		},
	};
</script>
