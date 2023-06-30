import {
    mdiHome,
    mdiBarcode,
    mdiAccountGroup,
    mdiBullhorn,
    mdiStarShooting,
    mdiDoorSliding,
    mdiRoomService,
    mdiVacuum,
    mdiBedQueen,
    mdiFoodTurkey,
    mdiSilverwareForkKnife,
    mdiSpa,
    mdiWeightLifter,
    mdiCube,
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
        label: "Serviços",
        icon: mdiRoomService,
        menu: [
            {
                to: "/service/1",
                label: "Limpeza",
                icon: mdiVacuum,
            },
            {
                to: "/service/2",
                label: "Objetos",
                icon: mdiBedQueen,
            },
            {
                to: "/service/3",
                label: "Alimentos",
                icon: mdiFoodTurkey,
            },
            {
                to: "/service/4",
                label: "Restaurante",
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
        to: "/items",
        label: "Objetos",
        icon: mdiCube,
    },
    {
        middleware: ["A", "M"],
        to: "/checkouts",
        label: "Check-Outs",
        icon: mdiDoorSliding,
    },
];
