<script setup>
import { computed, ref, watch, onMounted } from "vue";
import {
    mdiEye,
    mdiFoodCroissant,
    mdiFood,
    mdiFoodTurkey,
    mdiCoffee,
    mdiBeer,
    mdiCog,
    mdiShower,
    mdiBed,
    mdiCube,
} from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
import { useServiceStore } from "@/stores/service";
import { useItemStore } from "@/stores/item";

const itemStore = useItemStore();

const serviceStore = useServiceStore();

const props = defineProps({
    serviceId: {
        type: Number,
        default: null,
    },
});

const currentPage = ref(0);
const items = ref([]);
const numPages = computed(() => {
    if (props.serviceId != null) {
        return serviceStore.lastPage;
    } else {
        return itemStore.lastPage;
    }
});
const currentPageHuman = computed(() => currentPage.value + 1);

onMounted(async () => {
    if (props.serviceId != null) {
        items.value = await serviceStore.getItemsService(props.serviceId, 1);
    } else {
        items.value = await itemStore.getItems(1);
    }
});

watch(currentPageHuman, async () => {
    if (props.serviceId != null) {
        items.value = await serviceStore.getItemsService(
            props.serviceId,
            currentPage.value + 1
        );
    } else {
        items.value = await itemStore.getItems(currentPage.value + 1);
    }
});

watch(
    () => props.serviceId,
    () => {
        serviceStore.clearStore();
        setTimeout(async () => {
            items.value = await serviceStore.getItemsService(
                props.serviceId,
                1
            );
        }, 500);
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
                <th>Nome</th>
                <th>Nome em Inglês</th>
                <th v-if="props.serviceId == null">Tipo</th>
                <th>Categoria</th>
                <th>Stock</th>
                <th>Preço</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.nameEN }}</td>
                <td v-if="props.serviceId == null" class="text-center">
                    <PillTag
                        v-if="item.type == 'F'"
                        class="justify-center"
                        label="Comida"
                        color="warning"
                        :icon="mdiFood"
                        outline
                    />
                    <PillTag
                        v-else-if="item.type == 'O'"
                        class="justify-center"
                        label="Objeto"
                        color="success"
                        :icon="mdiCube"
                        outline
                    />
                </td>
                <td class="text-center">
                    <PillTag
                        v-if="item.category == 'drink'"
                        class="justify-center"
                        label="Bebida"
                        color="warning"
                        :icon="mdiBeer"
                    />
                    <PillTag
                        v-else-if="item.category == 'snack'"
                        class="justify-center"
                        label="Lanche"
                        color="success"
                        :icon="mdiCoffee"
                    />
                    <PillTag
                        v-else-if="item.category == 'breakfast'"
                        class="justify-center"
                        label="Pequeno-Almoço"
                        color="info"
                        :icon="mdiFoodCroissant"
                    />
                    <PillTag
                        v-else-if="item.category == 'lunch'"
                        class="justify-center"
                        label="Almoço"
                        color="contrast"
                        :icon="mdiFoodTurkey"
                    />
                    <PillTag
                        v-else-if="item.category == 'dinner'"
                        class="justify-center"
                        label="Jantar"
                        color="danger"
                        :icon="mdiFood"
                    />
                    <PillTag
                        v-else-if="item.category == 'room'"
                        class="justify-center"
                        label="Quarto"
                        color="warning"
                        :icon="mdiBed"
                    />
                    <PillTag
                        v-else-if="item.category == 'bathroom'"
                        class="justify-center"
                        label="Casa de Banho"
                        color="success"
                        :icon="mdiShower"
                    />
                    <PillTag
                        v-else
                        class="justify-center"
                        label="Jantar"
                        color="danger"
                        :icon="mdiCog"
                    />
                </td>
                <td class="text-center">
                    {{ item.stock ? item.stock : "N/A" }}
                </td>
                <td class="text-center">
                    {{ item.price ? item.price : "N/A" }}
                </td>
                <td>
                    <BaseButtons>
                        <BaseButton color="info" :icon="mdiEye" />
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
