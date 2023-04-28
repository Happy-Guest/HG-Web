import {
    mdiMenu,
    mdiClockOutline,
    mdiCloud,
    mdiCrop,
    mdiAccount,
    mdiCogOutline,
    mdiEmail,
    mdiLogout,
    mdiThemeLightDark,
} from "@mdi/js";

export default [
    {
        icon: mdiMenu,
        label: "Menu",
        menu: [
            {
                icon: mdiClockOutline,
                label: "Item Um",
            },
            {
                icon: mdiCloud,
                label: "Item Dois",
            },
            {
                isDivider: true,
            },
            {
                icon: mdiCrop,
                label: "Item Três",
            },
        ],
    },
    {
        icon: mdiThemeLightDark,
        label: "Claro/Escuro",
        isDesktopNoLabel: true,
        isToggleLightDark: true,
    },
    {
        isCurrentUser: true,
        menu: [
            {
                icon: mdiAccount,
                label: "Meu Perfil",
                to: "/perfil",
            },
            {
                icon: mdiEmail,
                label: "Mensagens",
            },
            {
                isDivider: true,
            },
            {
                icon: mdiCogOutline,
                label: "Configurações",
            },
        ],
    },
    {
        icon: mdiLogout,
        label: "Sair",
        isDesktopNoLabel: true,
        isLogout: true,
    },
];
