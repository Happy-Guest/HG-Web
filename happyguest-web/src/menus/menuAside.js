import {
    mdiHome,
    mdiSquareEditOutline,
    mdiTelevisionGuide,
    mdiBarcode,
    mdiAccountGroup,
} from "@mdi/js";

export default [
    {
        to: "/painel",
        icon: mdiHome,
        label: "Página Inicial",
    },
    {
        isDivider: true,
    },
    {
        middleware: ["A"],
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
