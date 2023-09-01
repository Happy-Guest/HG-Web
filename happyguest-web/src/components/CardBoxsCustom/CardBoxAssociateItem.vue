<script setup>
import { ref, watchEffect, watch } from "vue";
import {
    mdiContentSaveCheck,
    mdiBookPlus,
    mdiFoodVariant,
    mdiCursorText,
    mdiBookOpenPageVariant,
    mdiCancel,
    mdiReload,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";
import { useItemStore } from "@/stores/item";

const itemStore = useItemStore();

const itemId = ref();
const itemName = ref();
const validItem = ref(false);
const service = ref();

const isModalActive = ref(false);

const notifText = ref("");
const resErrors = ref([]);
const resMessage = ref("");

const props = defineProps({
    serviceId: {
        type: Number,
        default: 0,
    },
    active: {
        type: Boolean,
        default: false,
    },
});

watchEffect(() => {
    isModalActive.value = props.active;
});

const form = ref({
    items: [],
});

const emit = defineEmits(["update:active", "updated"]);

watch(
    () => props.serviceId,
    (value) => {
        if (value != service.value) {
            service.value = value;
            form.value.items = [];
            itemId.value = "";
            itemName.value = "";
            validItem.value = false;
            resMessage.value = "";
            resErrors.value = [];
        }
    }
);

watch(
    () => itemId.value,
    (value) => {
        if (value) {
            itemStore
                .getItem(value)
                .then((response) => {
                    if (response.id) {
                        if (props.serviceId == 2 && response.type != "O") {
                            validItem.value = false;
                            itemName.value = "Item não é um objeto!";
                        } else if (
                            props.serviceId == 3 &&
                            response.type != "F"
                        ) {
                            validItem.value = false;
                            itemName.value = "Item não é um alimento!";
                        } else {
                            validItem.value = true;
                            itemName.value = response.name;
                        }
                    } else {
                        validItem.value = false;
                        itemName.value = "Item não encontrado!";
                    }
                })
                .catch(() => {
                    validItem.value = false;
                    itemName.value = "";
                });
        }
    }
);

function addItem() {
    if (
        itemId.value &&
        validItem.value &&
        !form.value.items.includes(itemId.value)
    ) {
        form.value.items.push(itemId.value);
        itemId.value = "";
        itemName.value = "";
    }
}

function registerServiceItems() {
    if (form.value.items.length) {
        itemStore
            .associateItem(null, service.value, form.value.items)
            .then((response) => {
                notifText.value = response.data.message;
                if (response.status === 200) {
                    emit("updated");
                    emit("update:active", false);
                } else {
                    resErrors.value.push([response.data.message]);
                }
            })
            .catch(() => {
                notifText.value = "Ocorreu um erro ao associar os itens.";
            });
    }
}
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        title="Adicionar Item(s)"
        button-label="Adicionar"
        :icon="mdiContentSaveCheck"
        :icon-title="mdiBookPlus"
        button="success"
        has-errors
        has-cancel
        has-close
        :errors="resErrors"
        @cancel="emit('update:active', false)"
        @confirm="registerServiceItems()"
    >
        <FormField flex>
            <FormField
                label="ID Item"
                help="O ID do item. Obrigatório."
                class="w-full md:w-1/3 mb-4 sm:mb-0"
                label-for="item"
                flex
                no-margin
            >
                <FormControl
                    id="item"
                    v-model="itemId"
                    :icon="mdiFoodVariant"
                    name="Item"
                    class="w-10/12 flex flex-initial"
                    type="number"
                />
                <BaseButtons>
                    <BaseButton
                        color="success"
                        class="w-10 h-10 my-auto flex-initial mb-4"
                        :icon="!validItem ? mdiCancel : mdiBookPlus"
                        small
                        outline
                        rounded-full
                        title="Adicionar Item"
                        :disabled="!itemId || !validItem"
                        @click="addItem()"
                    />
                </BaseButtons>
            </FormField>
            <FormField
                label="Nome Item"
                help="O nome do item selecionado. Automático."
                class="w-full md:w-2/3"
                label-for="itemName"
            >
                <FormControl
                    id="itemName"
                    v-model="itemName"
                    :icon="mdiCursorText"
                    name="Item"
                    disabled
                />
            </FormField>
        </FormField>
        <FormField
            label="Item(s) Selecionado(s)"
            help="Os itens selecionados para o serviço. Obrigatório."
            class="w-full mb-4 sm:mb-0"
            label-for="items"
            flex
        >
            <FormControl
                id="items"
                class="w-11/12 flex flex-initial"
                :model-value="form.items.join(', ')"
                :icon="mdiBookOpenPageVariant"
                :placeholder="
                    form.items.length ? '' : 'Nenhum item selecionado.'
                "
                name="items"
                disabled
                required
            />
            <BaseButtons>
                <BaseButton
                    color="danger"
                    class="w-10 h-10 my-auto flex-initial mb-4"
                    :icon="!form.items.length > 0 ? mdiCancel : mdiReload"
                    small
                    outline
                    rounded-full
                    title="Adicionar Item"
                    :disabled="!form.items.length"
                    @click="form.items = []"
                />
            </BaseButtons>
        </FormField>
    </CardBoxModal>
</template>
