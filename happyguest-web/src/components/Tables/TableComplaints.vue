<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { mdiRename, mdiClose, mdiCheck, mdiFileCheck, mdiEye } from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import { useComplaintStore } from "@/stores/complaint";

const complaintStore = useComplaintStore();

const currentPage = ref(0);
const complaints = ref([]);
const numPages = computed(() => complaintStore.lastPage);
const currentPageHuman = computed(() => currentPage.value + 1);

const isModalActive = ref(false);
const selected = ref(0);

watch(currentPageHuman, async () => {
    complaints.value = await complaintStore.getComplaints(
        currentPage.value + 1
    );
});

onMounted(async () => {
    complaints.value = await complaintStore.getComplaints(1);
});

const pagesList = computed(() => {
    const pagesList = [];
    let num = [];
    let k = 0;
    for (let i = 0; i < numPages.value; i++) {
        if (k < 10) {
            num.push(i);
            k++;
        }
        if (k == 10 || i == numPages.value - 1) {
            pagesList.push(num);
            num = [];
            k = 0;
        }
    }
    return pagesList[parseInt(currentPage.value / 10)];
});
</script>

<template>
    <table class="w-full">
        <thead>
            <tr>
                <th>ID:</th>
                <th>Titulo:</th>
                <th>Quarto:</th>
                <th>Estado:</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="complaint in complaints" :key="complaint.id">
                <td data-label="Id">
                    {{ complaint.id }}
                </td>
                <td data-label="Titulo">
                    {{ complaint.title }}
                </td>
                <td data-label="Quarto" class="text-center">
                    {{ complaint.room }}
                </td>
                <td data-label="Estado" class="text-center">
                    <PillTag
                        v-if="complaint.status == 'P'"
                        class="w-36 justify-center"
                        label="P"
                        color="info"
                        :icon="mdiFileCheck"
                    />
                    <PillTag
                        v-else-if="complaint.status == 'R'"
                        class="w-36 justify-center"
                        label="R"
                        color="success"
                        :icon="mdiCheck"
                    />
                    <PillTag
                        v-else
                        class="w-36 justify-center"
                        label="C"
                        color="danger"
                        :icon="mdiClose"
                    />
                </td>
                <td
                    class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                >
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                            color="info"
                            title="Ver Reclamação"
                            :icon="mdiEye"
                            small
                            @click="
                                isModalActive = true;
                                selected = complaint.id;
                            "
                        />
                        <BaseButton
                            color="warning"
                            title="Responder"
                            :icon="mdiRename"
                            small
                            @click="
                                isModalActive = true;
                                selected = complaint.id;
                            "
                        />
                    </BaseButtons>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <BaseLevel>
            <BaseButtons>
                <BaseButton
                    v-if="currentPage > 0"
                    :label="'➤'"
                    class="font-bold rotate-180"
                    small
                    @click="currentPage = 0"
                />
                <BaseButton
                    v-if="currentPage > 0"
                    :label="'➜'"
                    class="font-bold rotate-180"
                    small
                    @click="currentPage--"
                />
                <BaseButton
                    v-for="page in pagesList"
                    :key="page"
                    :active="page === currentPage"
                    :label="page + 1"
                    :color="page === currentPage ? 'lightDark' : 'whiteDark'"
                    small
                    @click="currentPage = page"
                />

                <BaseButton
                    v-if="currentPage < numPages - 1"
                    :label="'➜'"
                    class="font-bold"
                    small
                    @click="currentPage++"
                />
                <BaseButton
                    v-if="currentPage < numPages - 1"
                    :label="'➤'"
                    class="font-bold"
                    small
                    @click="currentPage = numPages - 1"
                />
            </BaseButtons>
            <small>Página {{ currentPageHuman }} de {{ numPages }}</small>
        </BaseLevel>
    </div>
</template>
