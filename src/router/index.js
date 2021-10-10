import Vue from "vue";
import store from "@/store";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "users",
		component: () => import(/* webpackChunkName: "users" */ "../views/Users.vue"),
		meta: {
			requiresAuth: true,
			adminRole: true,
		},
	},
	{
		path: "/user",
		name: "user",
		component: () => import(/* webpackChunkName: "user" */ "../views/User.vue"),
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: "/login",
		name: "login",
		component: () => import(/* webpackChunkName: "login" */ "../views/Login.vue"),
		meta: {
			nav: false,
			requiresUnauth: true,
		},
	},
	{
		path: "/register",
		name: "register",
		component: () => import(/* webpackChunkName: "register" */ "../views/Register.vue"),
		meta: {
			nav: false,
			requiresUnauth: true,
		},
	},
	{
		path: "/vehicles",
		name: "vehicles",
		component: () => import(/* webpackChunkName: "vehicles" */ "../views/Vehicles.vue"),
		meta: {
			requiresAuth: true,
		},
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

router.beforeEach((to, _, next) => {
	store.commit(to.meta.nav === false ? "disableNavigation" : "enableNavigation");
	next();
});

router.beforeEach((to, _, next) => {
	store.dispatch("login/setToken");
	if (to.meta.requiresAuth && !store.getters["login/isAuthenticated"]) {
		next({
			path: "/login",
		});
	} else if (to.meta.adminRole && !store.getters["login/isAdmin"]) {
		next({
			path: "/user",
		});
	} else if (to.meta.requiresUnauth && store.getters["login/isAuthenticated"]) {
		store.commit("enableNavigation");

		if (store.getters["users/isAdmin"]) {
			next({
				path: "/",
			});
		} else {
			next({
				path: "/user",
			});
		}
	} else {
		next();
	}
});

export default router;
