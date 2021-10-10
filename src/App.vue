<template>
	<v-app>
		<app-bar v-if="nav" />
		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<script>
	import AppBar from "./components/AppBar.vue";
	import { mapGetters } from "vuex";

	export default {
		name: "App",
		components: { AppBar },
		computed: {
			...mapGetters(["nav"]),
		},
	};
</script>
