import { mdiAccount, mdiEmail, mdiLogout, mdiThemeLightDark } from "@mdi/js";

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
                isDivider: true,
            },
            {
                isNotif: true,
                icon: mdiEmail,
                label: "Notificações",
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
