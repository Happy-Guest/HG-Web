import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";
import auth from "@/middleware/auth";

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
            middleware: auth,
        },
        path: "/",
        name: "dashboard",
        component: Home,
    },
    {
        meta: {
            title: "Perfil",
            middleware: auth,
        },
        path: "/perfil",
        name: "profile",
        component: () => import("@/views/ProfileView.vue"),
    },

    {
        meta: {
            title: "Utilizadores",
            middleware: auth,
        },
        path: "/utilizadores",
        name: "users",
        component: () => import("@/views/UsersView.vue"),
    },

    {
        meta: {
            title: "Códigos",
            middleware: auth,
        },
        path: "/codigos",
        name: "codes",
        component: () => import("@/views/CodesView.vue"),
    },

    // Template

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
    scrollBehavior(savedPosition) {
        return savedPosition || { top: 0 };
    },
});

function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    if (!subsequentMiddleware) return context.next;
    return (...parameters) => {
        context.next(...parameters);
        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({ ...context, next: nextMiddleware });
    };
}

router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
        const middleware = Array.isArray(to.meta.middleware)
            ? to.meta.middleware
            : [to.meta.middleware];
        const context = {
            from,
            next,
            router,
            to,
        };
        const nextMiddleware = nextFactory(context, middleware, 1);
        return middleware[0]({ ...context, next: nextMiddleware });
    }
    return next();
});

export default router;
