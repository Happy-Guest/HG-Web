<script setup>
import { ref, onMounted } from "vue";
import {
    mdiAccountMultiple,
    mdiBullhorn,
    mdiBarcode,
    mdiReload,
    mdiChartPie,
    mdiHome,
} from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import LineChart from "@/components/Charts/LineChart.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import CardBoxWidget from "@/components/CardBoxs/CardBoxWidget.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import { useMainStore } from "@/stores/main";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { createToaster } from "@meforma/vue-toaster";

const mainStore = useMainStore();

const chartData = ref(null);
const statistics = ref({
    clients: 0,
    codes: 0,
    complaints: 0,
    percentageClients: 0,
    percentageCodesUsed: 0,
    percentageComplaints: 0,
});

const fillChartData = async (data, reload) => {
    if (reload) {
        chartData.value = null;
        await mainStore.getHomeGraph().then((response) => {
            chartData.value = chartConfig.chartData(12, response.data);
        });
    } else {
        chartData.value = chartConfig.chartData(12, data);
    }
};

onMounted(async () => {
    await mainStore.getHomeStatistics().then((response) => {
        statistics.value = response.data;
    });
    await mainStore.getHomeGraph().then((response) => {
        fillChartData(response.data);
    });
});

/* Firebase Notifs */
const firebaseConfig = {
    apiKey: "AIzaSyAucBbldmHvC2YxZ4d4w6W_KLaAsRuJjpA",
    authDomain: "happyguest-ipl.firebaseapp.com",
    projectId: "happyguest-ipl",
    storageBucket: "happyguest-ipl.appspot.com",
    messagingSenderId: "825950088067",
    appId: "1:825950088067:web:b7c49a380b2463779064b6",
    measurementId: "G-G7JHEECZ5T",
};

const toast = createToaster();

// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);

const messaging = getMessaging();

onMessage(messaging, (payload) => {
    toast.success(payload.notification.body);
});

getToken(messaging, {
    vapidKey:
        "BFrd_fWqUL5Teaq3rrubjvhh5dea_zKVmgEAYSuBeerJrx3w9athL5_fcYO30xQHnuxZKvpplqtRpRR4vVaibfc",
})
    .then((currentToken) => {
        if (currentToken) {
            console.log(currentToken);
            // Send the token API
            mainStore.sendNotifToken(currentToken);
        } else {
            console.log(
                "No registration token available. Request permission to generate one."
            );
        }
    })
    .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
    });
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine :icon="mdiHome" title="Página Inicial" main>
            </SectionTitleLine>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
                <CardBoxWidget
                    :trend="
                        statistics?.percentageClients == 0
                            ? 'Neutro'
                            : statistics?.percentageClients + '%'
                    "
                    :trend-type="
                        statistics?.percentageClients == 0
                            ? 'zero'
                            : statistics?.percentageClients > 0
                            ? 'up'
                            : 'down'
                    "
                    color="text-emerald-500"
                    :icon="mdiAccountMultiple"
                    :number="statistics?.clients"
                    label="Total Clientes"
                />
                <CardBoxWidget
                    :trend="statistics?.codes + ' Códigos'"
                    trend-type="code"
                    color="text-blue-500"
                    :icon="mdiBarcode"
                    :number="statistics?.percentageCodesUsed"
                    suffix="%"
                    label="Códigos Usados"
                />
                <CardBoxWidget
                    :trend="
                        statistics?.percentageComplaints == 0
                            ? 'Neutro'
                            : statistics?.percentageComplaints + '%'
                    "
                    :trend-type="
                        statistics?.percentageComplaints == 0
                            ? 'zero'
                            : statistics?.percentageComplaints > 70
                            ? 'alert'
                            : statistics?.percentageComplaints > 0
                            ? 'up'
                            : 'down'
                    "
                    color="text-red-500"
                    :icon="mdiBullhorn"
                    :number="statistics?.complaints"
                    label="Total Reclamações"
                />
            </div>

            <SectionTitleLine :icon="mdiChartPie" title="Registos por Mês">
                <BaseButton
                    :icon="mdiReload"
                    color="whiteDark"
                    @click="fillChartData(null, true)"
                />
            </SectionTitleLine>

            <CardBox class="mb-6">
                <div v-if="chartData">
                    <line-chart :data="chartData" class="h-96" />
                </div>
                <div class="mt-4">
                    <b class="text-lg">Legenda:</b>
                    <span class="text-emerald-500 ml-4">Clientes</span>
                    <span class="text-blue-500 ml-4">Códigos</span>
                    <span class="text-red-500 ml-4">Reclamações</span>
                </div>
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
