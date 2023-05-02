<script setup>
import { ref, onMounted } from "vue";
import {
    mdiAccountMultiple,
    mdiCartOutline,
    mdiChartTimelineVariant,
    mdiMonitorCellphone,
    mdiReload,
    mdiGithub,
    mdiChartPie,
    mdiHome,
} from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import LineChart from "@/components/Charts/LineChart.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import CardBoxWidget from "@/components/CardBoxs/CardBoxWidget.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import NotificationBar from "@/components/Others/NotificationBar.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import CardBoxTransaction from "@/components/CardBoxsCustom/CardBoxTransaction.vue";
import CardBoxClient from "@/components/CardBoxsCustom/CardBoxClient.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";

const chartData = ref(null);

const fillChartData = () => {
    chartData.value = chartConfig.sampleChartData();
};

onMounted(() => {
    fillChartData();
});
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine :icon="mdiHome" title="Página Inicial" main>
                <BaseButton
                    href="https://github.com/justboil/admin-one-vue-tailwind"
                    target="_blank"
                    :icon="mdiGithub"
                    label="Star on GitHub"
                    color="contrast"
                    rounded-full
                    small
                />
            </SectionTitleLine>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
                <CardBoxWidget
                    trend="12%"
                    trend-type="up"
                    color="text-emerald-500"
                    :icon="mdiAccountMultiple"
                    :number="512"
                    label="Clients"
                />
                <CardBoxWidget
                    trend="12%"
                    trend-type="down"
                    color="text-blue-500"
                    :icon="mdiCartOutline"
                    :number="7770"
                    prefix="$"
                    label="Sales"
                />
                <CardBoxWidget
                    trend="Overflow"
                    trend-type="alert"
                    color="text-red-500"
                    :icon="mdiChartTimelineVariant"
                    :number="256"
                    suffix="%"
                    label="Performance"
                />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div class="flex flex-col justify-between">
                    <CardBoxTransaction
                        v-for="(transaction, index) in transactionBarItems"
                        :key="index"
                        :amount="transaction.amount"
                        :date="transaction.date"
                        :business="transaction.business"
                        :type="transaction.type"
                        :name="transaction.name"
                        :account="transaction.account"
                    />
                </div>
                <div class="flex flex-col justify-between">
                    <CardBoxClient
                        v-for="client in clientBarItems"
                        :key="client.id"
                        :name="client.name"
                        :login="client.login"
                        :date="client.created"
                        :progress="client.progress"
                    />
                </div>
            </div>

            <SectionTitleLine :icon="mdiChartPie" title="Trends overview">
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

            <SectionTitleLine :icon="mdiAccountMultiple" title="Clients" />

            <NotificationBar color="info" :icon="mdiMonitorCellphone">
                <b>Responsive table.</b> Collapses on mobile
            </NotificationBar>

            <CardBox has-table>
                <TableSampleClients />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
