import {
    mdiHome,
    mdiBarcode,
    mdiAccountGroup,
    mdiBullhorn,
    mdiStarShooting,
    mdiFolderKey,
    mdiReceiptClock,
    mdiNewspaperVariant,
    mdiVacuum,
    mdiPaperRoll,
    mdiFood,
    mdiSilverwareForkKnife,
    mdiSpa,
    mdiWeightLifter,
    mdiBookOpenPageVariant,
    mdiBookClock,
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
        isDivider: true,
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
        icon: mdiFolderKey,
    },
    {
        isDivider: true,
    },
    {
        to: "/items",
        label: "Menu",
        icon: mdiBookOpenPageVariant,
    },
    {
        middleware: ["A", "M"],
        label: "Serviços",
        icon: mdiNewspaperVariant,
        menu: [
            {
                to: "/service/2",
                label: "Objetos",
                icon: mdiPaperRoll,
            },
            {
                to: "/service/3",
                label: "Alimentos",
                icon: mdiFood,
            },
            {
                to: "/service/1",
                label: "Limpeza",
                icon: mdiVacuum,
            },
            {
                to: "/service/4",
                label: "Reservar Mesa",
                icon: mdiSilverwareForkKnife,
            },
            {
                to: "/service/5",
                label: "Spa",
                icon: mdiSpa,
            },
            {
                to: "/service/6",
                label: "Ginásio",
                icon: mdiWeightLifter,
            },
        ],
    },
    {
        middleware: ["A", "M"],
        to: "/orders",
        label: "Pedidos",
        icon: mdiReceiptClock,
    },
    {
        middleware: ["A", "M"],
        //to: "/checkouts",
        label: "Reservas",
        icon: mdiBookClock,
    },
];
