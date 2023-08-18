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
    mdiHomeAnalytics,
    mdiForest,
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
        middleware: ["A", "M", "E"],
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
        middleware: ["A", "M", "E"],
        to: "/orders",
        label: "Pedidos",
        icon: mdiBookClock,
    },
    {
        middleware: ["A", "M", "E"],
        to: "/reserves",
        label: "Reservas",
        icon: mdiReceiptClock,
    },
    {
        isDivider: true,
    },
    {
        middleware: ["A", "M", "E"],
        to: "/hotel",
        label: "Hotel",
        icon: mdiHomeAnalytics,
    },
    {
        middleware: ["A", "M", "E"],
        to: "/region",
        label: "Região",
        icon: mdiForest,
    },
];
