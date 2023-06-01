import {
    mdiHome,
    mdiBarcode,
    mdiAccountGroup,
    mdiBullhorn,
    mdiStarShooting,
    mdiDoorSliding,
} from "@mdi/js";

export default [
    {
        to: "/painel",
        icon: mdiHome,
        label: "Página Inicial",
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
        icon: mdiBullhorn,
    },
    {
        middleware: ["A", "M"],
        to: "/avaliacoes",
        label: "Avaliações",
        icon: mdiStarShooting,
    },
    {
        middleware: ["A", "M"],
        to: "/checkouts",
        label: "Check-Outs",
        icon: mdiDoorSliding,
    },
];
