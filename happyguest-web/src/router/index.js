import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";

const routes = [
    {
        meta: {
            title: "Página Inicial",
        },
        path: "/",
        name: "dashboard",
        component: Home,
    },
    {
        meta: {
            title: "Tabelas",
        },
        path: "/tabelas",
        name: "tables",
        component: () => import("@/views/TablesView.vue"),
    },
    {
        meta: {
            title: "Formulários",
        },
        path: "/formularios",
        name: "forms",
        component: () => import("@/views/FormsView.vue"),
    },
    {
        meta: {
            title: "Perfil",
        },
        path: "/perfil",
        name: "profile",
        component: () => import("@/views/ProfileView.vue"),
    },
    {
        meta: {
            title: "Interface",
        },
        path: "/interface",
        name: "ui",
        component: () => import("@/views/UiView.vue"),
    },
    {
        meta: {
            title: "Login",
        },
        path: "/login",
        name: "login",
        component: () => import("@/views/LoginView.vue"),
    },

    // Not Found

    {
        path: "/:pathMatch(.*)*",
        component: () => import("@/views/NotFoundView.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 };
    },
});

export default router;
