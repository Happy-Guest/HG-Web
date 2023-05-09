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
        to: "/reclamacoes",
        label: "Reclamações",
        icon: mdiBullhornVariant,
    },
    {
        isDivider: true,
    },
];
