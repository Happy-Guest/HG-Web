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

const mainStore = useMainStore();

const chartData = ref(null);
const statistics = ref(null);

const fillChartData = () => {
    chartData.value = chartConfig.sampleChartData();
};

onMounted(async () => {
    fillChartData();
    await mainStore.getHomeStatistics().then((response) => {
        statistics.value = response.data;
        console.log(statistics.value);
    });
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
                    :trend-type="info"
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

            <SectionTitleLine
                :icon="mdiChartPie"
                title="Gráfico de Reclamações"
            >
                <BaseButton
                    :icon="mdiReload"
                    color="whiteDark"
                    @click="fillChartData"
                />
            </SectionTitleLine>

            <CardBox class="mb-6">
                <div v-if="chartData">
                    <line-chart :data="chartData" class="h-96" />
                </div>
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
