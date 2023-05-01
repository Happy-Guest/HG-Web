import {
    mdiHomeOutline,
    mdiSquareEditOutline,
    mdiTable,
    mdiTelevisionGuide,
    mdiBarcode,
    mdiAccountGroup,
} from "@mdi/js";

export default [
    {
        to: "/",
        icon: mdiHomeOutline,
        label: "Página Inicial",
    },
    {
        isDivider: true,
    },
    {
        to: "/utilizadores",
        label: "Utilizadores",
        icon: mdiAccountGroup,
    },
    {
        to: "/codigos",
        label: "Códigos",
        icon: mdiBarcode,
    },

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
