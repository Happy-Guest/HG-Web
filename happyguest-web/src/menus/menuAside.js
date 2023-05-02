import {
    mdiHomeOutline,
    mdiSquareEditOutline,
    mdiTelevisionGuide,
    mdiBarcode,
    mdiAccountGroup,
} from "@mdi/js";

export default [
    {
        to: "/painel",
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
