import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue";
import auth from "@/middleware/auth";
import guest from "@/middleware/guest";
import manager from "@/middleware/manager";
import employee from "@/middleware/employee";

const routes = [
    // Home
    {
        meta: {
            title: "Página Inicial",
        },
        path: "/",
        name: "home",
        component: Home,
    },

    // Auth

    {
        meta: {
            title: "Login",
            middleware: guest,
        },
        path: "/login",
        name: "login",
        component: () => import("@/views/Auth/LoginView.vue"),
    },
    {
        meta: {
            title: "Registo",
            middleware: [auth, manager],
        },
        path: "/registo",
        name: "register",
        component: () => import("@/views/Auth/RegisterView.vue"),
    },

    // Dashboard

    {
        meta: {
            title: "Painel",
            middleware: auth,
        },
        path: "/painel",
        name: "dashboard",
        component: () => import("@/views/Dashboard/HomeView.vue"),
    },
    {
        meta: {
            title: "Perfil",
            middleware: auth,
        },
        path: "/perfil",
        name: "profile",
        component: () => import("@/views/Dashboard/ProfileView.vue"),
    },

    // Manager & Admin

    {
        meta: {
            title: "Utilizadores",
            middleware: [auth, manager],
        },
        path: "/utilizadores",
        name: "users",
        component: () => import("@/views/Dashboard/UsersView.vue"),
    },
    {
        meta: {
            title: "Códigos",
            middleware: [auth, manager],
        },
        path: "/codigos",
        name: "codes",
        component: () => import("@/views/Dashboard/CodesView.vue"),
    },
    {
        meta: {
            title: "Reclamações",
            middleware: [auth, manager],
        },
        path: "/reclamacoes",
        name: "complaints",
        component: () =>
            import("@/views/Dashboard/Complaints/ComplaintsView.vue"),
    },
    {
        meta: {
            title: "Reclamação",
            middleware: [auth, manager],
        },
        path: "/reclamacao",
        name: "complaintCreate",
        component: () =>
            import("@/views/Dashboard/Complaints/ComplaintView.vue"),
    },
    {
        meta: {
            title: "Reclamação",
            middleware: [auth, manager],
        },
        path: "/reclamacao/:id",
        name: "complaintView",
        component: () =>
            import("@/views/Dashboard/Complaints/ComplaintView.vue"),
    },
    {
        meta: {
            title: "Avaliações",
            middleware: [auth, manager],
        },
        path: "/avaliacoes",
        name: "reviews",
        component: () => import("@/views/Dashboard/ReviewsView.vue"),
    },
    {
        meta: {
            title: "Check-Outs",
            middleware: [auth, manager],
        },
        path: "/checkouts",
        name: "checkouts",
        component: () => import("@/views/Dashboard/CheckoutsView.vue"),
    },

    // Employee & Manager & Admin

    {
        meta: {
            title: "Perfil",
            middleware: [auth, employee],
        },
        path: "/perfil/:id",
        name: "profileUser",
        component: () => import("@/views/Dashboard/ProfileView.vue"),
    },
    {
        meta: {
            title: "Serviços",
            middleware: [auth, employee],
        },
        path: "/service/:id",
        name: "services",
        component: () => import("@/views/Dashboard/ServicesView.vue"),
    },
    {
        meta: {
            title: "Objetos",
            middleware: [auth, employee],
        },
        path: "/items",
        name: "items",
        component: () => import("@/views/Dashboard/ItemsView.vue"),
    },
    {
        meta: {
            title: "Pedidos",
            middleware: [auth, employee],
        },
        path: "/orders",
        name: "orders",
        component: () => import("@/views/Dashboard/Orders/OrdersView.vue"),
    },
    {
        meta: {
            title: "Pedido",
            middleware: [auth, employee],
        },
        path: "/order",
        name: "orderRegister",
        component: () => import("@/views/Dashboard/Orders/OrderView.vue"),
    },
    {
        meta: {
            title: "Pedido",
            middleware: [auth, employee],
        },
        path: "/order/:id",
        name: "orderView",
        component: () => import("@/views/Dashboard/Orders/OrderView.vue"),
    },
    {
        meta: {
            title: "Reservas",
            middleware: [auth, employee],
        },
        path: "/reserves",
        name: "reserves",
        component: () => import("@/views/Dashboard/Reserves/ReservesView.vue"),
    },
    {
        meta: {
            title: "Reserva",
            middleware: [auth, employee],
        },
        path: "/reserve",
        name: "reserveRegister",
        component: () => import("@/views/Dashboard/Reserves/ReserveView.vue"),
    },
    {
        meta: {
            title: "Reserva",
            middleware: [auth, employee],
        },
        path: "/reserve/:id",
        name: "reserveView",
        component: () => import("@/views/Dashboard/Reserves/ReserveView.vue"),
    },
    {
        meta: {
            title: "Hotel",
            middleware: [auth, employee],
        },
        path: "/hotel",
        name: "hotel",
        component: () => import("@/views/Dashboard/HotelView.vue"),
    },
    {
        meta: {
            title: "Região",
            middleware: [auth, employee],
        },
        path: "/region",
        name: "region",
        component: () => import("@/views/Dashboard/RegionView.vue"),
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
