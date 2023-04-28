import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";

const routes = [
    // Auth

    {
        meta: {
            title: "Login",
        },
        path: "/login",
        name: "login",
        component: () => import("@/views/Auth/LoginView.vue"),
    },

    // Dashboard

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
            title: "Perfil",
        },
        path: "/perfil",
        name: "profile",
        component: () => import("@/views/ProfileView.vue"),
    },

    // Template

    {
        meta: {
            title: "Tabelas",
        },
        path: "/tabelas",
        name: "tables",
        component: () => import("@/views/Template/TablesView.vue"),
    },
    {
        meta: {
            title: "Formulários",
        },
        path: "/formularios",
        name: "forms",
        component: () => import("@/views/Template/FormsView.vue"),
    },
    {
        meta: {
            title: "Interface",
        },
        path: "/interface",
        name: "ui",
        component: () => import("@/views/Template/UiView.vue"),
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
