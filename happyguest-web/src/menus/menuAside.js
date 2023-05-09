import {
    mdiHome,
    mdiBarcode,
    mdiAccountGroup,
    mdiBullhornVariant,
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
        middleware: ["A", "M"],
        to: "/utilizadores",
        label: "Utilizadores",
        icon: mdiAccountGroup,
    },
    {
        middleware: ["A", "M"],
        to: "/codigos",
        label: "Códigos",
        icon: mdiBarcode,
    },
    {
        middleware: ["A", "M"],
        to: "/reclamacoes",
        label: "Reclamações",
        icon: mdiBullhornVariant,
    },
    {
        isDivider: true,
    },
];
