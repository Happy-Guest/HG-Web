<script setup>
import { computed, ref, watch, onMounted, watchEffect } from "vue";
import {
    mdiPackageCheck,
    mdiClockTimeTwoOutline,
    mdiCheck,
    mdiClose,
    mdiTrashCan,
    mdiRename,
    mdiSilverwareForkKnife,
    mdiNewspaperVariant,
    mdiEye,
} from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import { useReserveStore } from "@/stores/reserve";
import { useRouter } from "vue-router";

const router = useRouter();

const reserveStore = useReserveStore();

const selected = ref(null);

const props = defineProps({
    filter: {
        type: String,
        default: "ALL",
    },
    order: {
        type: String,
        default: "DESC",
    },
});

const currentPage = ref(0);
const reserves = ref([]);
const numPages = computed(() => reserveStore.lastPage);

const currentPageHuman = computed(() => currentPage.value + 1);

async function getReserves() {
    reserves.value = await reserveStore.getReserves(
        currentPage.value + 1,
        props.filter,
        props.order
    );
}

onMounted(async () => {
    if (reserveStore.updateTable != true) {
        await getReserves();
    }
});

async function reloadTable() {
    reserveStore.clearStore();
    setTimeout(async () => {
        await getReserves();
    }, 200);
}

watchEffect(async () => {
    if (reserveStore.updateTable) {
        await reloadTable();
        if (reserves.value.length == 0 && currentPage.value > 0) {
            currentPage.value--;
            await reloadTable();
        }
    }
});

watch(currentPageHuman, async () => {
    await getReserves();
});

watch(
    () => props.order,
    async () => {
        await reloadTable();
    }
);

watch(
    () => props.filter,
    async () => {
        await reloadTable();
    }
);

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
                <th>Cliente:</th>
                <th>Serviço:</th>
                <th>Nº Pessoas:</th>
                <th>Estado:</th>
                <th>Horário:</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="reserve in reserves" :key="reserve.id">
                <td
                    data-label="ID"
                    class="text-center text-gray-500 dark:text-slate-400 font-semibold"
                >
                    {{ reserve.id }}
                </td>
                <td data-label="Cliente">
                    {{ reserve.user }}
                </td>

                <td data-label="Serviço" class="text-center font-semibold">
                    <PillTag
                        class="justify-center"
                        :label="reserve.service.name"
                        :color="
                            reserve.service.type == 'R' ? 'success' : 'info'
                        "
                        :icon="
                            reserve.service.type == 'C'
                                ? mdiSilverwareForkKnife
                                : mdiNewspaperVariant
                        "
                        outline
                    />
                </td>
                <td data-label="Nº Pessoas" class="text-center font-semibold">
                    <PillTag
                        class="justify-center ml-2 font-semibold"
                        :label="reserve.nr_people.toString()"
                        color="info"
                    />
                </td>
                <td data-label="Estado" class="text-center">
                    <PillTag
                        v-if="reserve.status == 'P'"
                        class="justify-center"
                        label="Pendente"
                        color="info"
                        :icon="mdiClockTimeTwoOutline"
                    />
                    <PillTag
                        v-else-if="reserve.status == 'A'"
                        class="justify-center"
                        label="Aceite"
                        color="success"
                        :icon="mdiPackageCheck"
                    />
                    <PillTag
                        v-else-if="reserve.status == 'R'"
                        class="justify-center"
                        label="Rejeitado"
                        color="danger"
                        :icon="mdiCheck"
                    />
                    <PillTag
                        v-else
                        class="justify-center"
                        label="Cancelado"
                        color="contrast"
                        :icon="mdiClose"
                    />
                </td>
                <td
                    data-label="Horário"
                    class="text-center text-gray-500 dark:text-slate-400 font-semibold"
                >
                    {{ reserve.time }}
                </td>
                <td
                    class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                >
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                            color="info"
                            title="Ver Reserva"
                            :icon="mdiEye"
                            small
                            @click="
                                router.push({
                                    name: 'reserveView',
                                    params: { id: reserve.id },
                                })
                            "
                        />
                        <BaseButton
                            color="warning"
                            title="Alterar estado"
                            :icon="mdiRename"
                            small
                            @click="
                                isModalActive = true;
                                selected = reserve.id;
                            "
                        />
                        <BaseButton
                            color="danger"
                            title="Remover"
                            :icon="mdiTrashCan"
                            small
                            @click="
                                isModalDeleteActive = true;
                                selected = reserve.id;
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
