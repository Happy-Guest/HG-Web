import {
    mdiHomeOutline,
    mdiSquareEditOutline,
    mdiTable,
    mdiTelevisionGuide,
} from "@mdi/js";

export default [
    {
        to: "/",
        icon: mdiHomeOutline,
        label: "Página Inicial",
    },

    // Template

    {
        isDivider: true,
    },
    {
        to: "/tabelas",
        label: "Tabelas",
        icon: mdiTable,
    },
    {
        to: "/formularios",
        label: "Formulários",
        icon: mdiSquareEditOutline,
    },
    {
        to: "/interface",
        label: "Interface",
        icon: mdiTelevisionGuide,
    },
];
