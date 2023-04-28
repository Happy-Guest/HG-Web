<script setup>
import {
    mdiMonitorCellphone,
    mdiTableBorder,
    mdiTableOff,
    mdiGithub,
} from "@mdi/js";
import SectionMain from "@/components/Sections/SectionMain.vue";
import NotificationBar from "@/components/Others/NotificationBar.vue";
import TableSampleClients from "@/components/Tables/TableSampleClients.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine :icon="mdiTableBorder" title="Tabelas" main>
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
            <NotificationBar color="info" :icon="mdiMonitorCellphone">
                <b>Responsive table.</b> Collapses on mobile
            </NotificationBar>

            <CardBox class="mb-6" has-table>
                <TableSampleClients checkable />
            </CardBox>

            <SectionTitleLine :icon="mdiTableOff" title="Empty variation" />

            <NotificationBar color="danger" :icon="mdiTableOff">
                <b>Empty table.</b> When there's nothing to show
            </NotificationBar>

            <CardBox>
                <CardBoxComponentEmpty />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
