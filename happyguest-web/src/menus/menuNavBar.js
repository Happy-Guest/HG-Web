import {
    mdiAccount,
    mdiCogOutline,
    mdiEmail,
    mdiLogout,
    mdiThemeLightDark,
} from "@mdi/js";

export default [
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
