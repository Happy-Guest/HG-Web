<script setup>
import { ref, watchEffect, watch } from "vue";
import {
    mdiContentSaveCheck,
    mdiCursorText,
    mdiFilePlus,
    mdiCurrencyEur,
    mdiPackage,
    mdiFormatListBulletedType,
    mdiBookOpenPageVariant,
    mdiFood,
    mdiPaperRoll,
    mdiBed,
    mdiShower,
    mdiFoodVariant,
    mdiBeer,
    mdiFoodCroissant,
    mdiFoodTurkey,
    mdiHamburger,
    mdiFoodApple,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormCheckRadioGroup from "@/components/Forms/FormCheckRadioGroup.vue";
import FormField from "@/components/Forms/FormField.vue";
import { useItemStore } from "@/stores/item";
import BaseDivider from "../Bases/BaseDivider.vue";

const itemStore = useItemStore();

const isModalActive = ref(false);

const resMessage = ref("");
const resErrors = ref([]);

const props = defineProps({
    selected: {
        type: Number,
        default: -1,
    },
    active: {
        type: Boolean,
        default: false,
    },
});

watchEffect(() => {
    isModalActive.value = props.active;
});

const selectOptionsType = [
    { id: 0, label: "Objeto", value: "O", icon: mdiPaperRoll },
    { id: 1, label: "Alimento", value: "F", icon: mdiFood },
];

const selectOptionsObjects = [
    { id: 0, value: "room", label: "Quarto", icon: mdiBed },
    { id: 0, value: "bathroom", label: "Casa Banho", icon: mdiShower },
    { id: 0, value: "other", label: "Outros", icon: mdiFoodVariant },
];

const selectOptionsFood = [
    { id: 0, value: "drink", label: "Bebidas", icon: mdiBeer },
    { id: 0, value: "breakfast", label: "P. Almoço", icon: mdiFoodCroissant },
    { id: 0, value: "lunch", label: "Almoço", icon: mdiFoodTurkey },
    { id: 0, value: "dinner", label: "Jantar", icon: mdiHamburger },
    { id: 0, value: "snack", label: "Lanches", icon: mdiFoodApple },
    { id: 0, value: "other", label: "Outros", icon: mdiFoodVariant },
];

const form = ref({
    name: "",
    nameEN: "",
    type: "",
    category: "",
    stock: "",
    price: "",
    associate: false,
});

function clearForm() {
    form.value.name = "";
    form.value.nameEN = "";
    form.value.type = "";
    form.value.category = "";
    form.value.stock = "";
    form.value.price = "";
}

watch(
    () => props.selected,
    async (value) => {
        resErrors.value = [];
        await itemStore.getItem(value).then((response) => {
            form.value.name = response.name;
            form.value.nameEN = response.nameEN;
            form.value.type = selectOptionsType.find(
                (option) => option.value == response.type
            );
            if (response.type == "O") {
                form.value.category = selectOptionsObjects.find(
                    (option) => option.value == response.category
                );
            } else {
                form.value.category = selectOptionsFood.find(
                    (option) => option.value == response.category
                );
            }
            form.value.stock = response.stock ? response.stock : "";
            form.value.price = response.price ? response.price : "";
        });
    }
);

const emit = defineEmits(["update:active", "updated"]);

const registerItem = async () => {
    itemStore
        .registerItem({
            name: form.value.name,
            nameEN: form.value.nameEN,
            type: form.value.type.value,
            category: form.value.category.value,
            stock: form.value.stock,
            price: form.value.price,
        })
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status == 201) {
                isModalActive.value = false;
                itemStore.updateTable = true;
                emit("update:active", false);
                emit("updated", true);
                clearForm();
                if (form.value.associate) {
                    itemStore.associateItem(
                        response.data.item.id,
                        response.data.item.type == "O" ? 2 : 3
                    );
                }
                resErrors.value = [];
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            resMessage.value = "Ocorreu um erro ao registar o item.";
        });
};

const updateItem = async () => {
    itemStore
        .updateItem(props.selected, {
            name: form.value.name,
            nameEN: form.value.nameEN,
            category: form.value.category.value,
            stock: form.value.stock ? form.value.stock : null,
            price: form.value.price,
        })
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status == 200) {
                isModalActive.value = false;
                itemStore.updateTable = true;
                emit("updated", response.data.item);
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            resMessage.value = "Ocorreu um erro ao atualizar o item.";
        });
};
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        :title="
            props.selected != -1
                ? 'Editar Item ➯ ' + props.selected
                : 'Registar Item'
        "
        :button-label="props.selected != -1 ? 'Atualizar' : 'Registar'"
        :icon="mdiContentSaveCheck"
        :icon-title="mdiFilePlus"
        button="success"
        has-errors
        has-cancel
        has-close
        :errors="resErrors"
        @cancel="emit('update:active', false)"
        @confirm="props.selected != -1 ? updateItem() : registerItem()"
    >
        <FormField flex>
            <FormField
                label="Nome"
                help="O nome do item. Obrigatório."
                class="w-full md:w-2/4 mb-4 sm:mb-0"
                :label-for="props.selected ? 'nameEdit' : 'name'"
            >
                <FormControl
                    :id="props.selected ? 'nameEdit' : 'name'"
                    v-model="form.name"
                    maxlength="255"
                    type="text"
                    :icon="mdiCursorText"
                    name="name"
                    required
                />
            </FormField>
            <FormField
                label="Nome (Inglês)"
                help="O nome do item em inglês. Obrigatório."
                class="w-full md:w-2/4 mb-2 sm:mb-0"
                :label-for="props.selected ? 'nameENEdit' : 'nameEN'"
                no-margin
            >
                <FormControl
                    :id="props.selected ? 'nameENEdit' : 'nameEN'"
                    v-model="form.nameEN"
                    maxlength="255"
                    type="text"
                    :icon="mdiCursorText"
                    name="nameEN"
                    required
                />
            </FormField>
        </FormField>
        <FormField flex>
            <FormField
                label="Tipo"
                help="O tipo do item. Obrigatório."
                class="w-full md:w-2/4 mb-3 sm:mb-4"
                :label-for="props.selected ? 'typeEdit' : 'type'"
            >
                <FormControl
                    :id="props.selected ? 'typeEdit' : 'type'"
                    v-model="form.type"
                    :icon="form.type.icon || mdiBookOpenPageVariant"
                    name="type"
                    :disabled="props.selected != -1"
                    :options="selectOptionsType"
                    required
                />
            </FormField>
            <FormField
                label="Categoria"
                help="A categoria do item. Obrigatório."
                class="w-full md:w-2/4 mb-3 sm:mb-0"
                :label-for="props.selected ? 'categoryEdit' : 'category'"
                no-margin
            >
                <FormControl
                    :id="props.selected ? 'categoryEdit' : 'category'"
                    v-model="form.category"
                    :icon="form.category.icon || mdiFormatListBulletedType"
                    :options="
                        form.type.value === 'O'
                            ? selectOptionsObjects
                            : form.type.value === 'F'
                            ? selectOptionsFood
                            : []
                    "
                    :disabled="form.type === ''"
                    name="category"
                />
            </FormField>
        </FormField>

        <BaseDivider />

        <FormField flex>
            <FormField
                label="Stock"
                help="O stock do item. Opcional."
                class="w-full md:w-2/4 mb-4 sm:mb-0"
                :label-for="props.selected ? 'stockEdit' : 'stock'"
            >
                <FormControl
                    :id="props.selected ? 'stockEdit' : 'stock'"
                    v-model="form.stock"
                    type="number"
                    :icon="mdiPackage"
                    :placeholder="
                        form.stock == '' && props.selected != -1
                            ? 'Não definido'
                            : ''
                    "
                    name="stock"
                />
            </FormField>
            <FormField
                label="Preço"
                help="O preço do item. Obrigatório em alimentos."
                class="w-full md:w-2/4 mb-4 sm:mb-0"
                :label-for="props.selected ? 'priceEdit' : 'price'"
            >
                <FormControl
                    :id="props.selected ? 'priceEdit' : 'price'"
                    v-model="form.price"
                    type="number"
                    :icon="mdiCurrencyEur"
                    :placeholder="
                        form.price == '' && props.selected != -1
                            ? 'Não definido'
                            : ''
                    "
                    name="price"
                    :required="form.type.value === 'F'"
                />
            </FormField>
        </FormField>
        <FormField>
            <FormCheckRadioGroup
                v-model="form.associate"
                class="mt-6 ml-4"
                name="associate-checkbox"
                :options="{ true: 'Adicionar ao Menu Atual' }"
            />
        </FormField>
    </CardBoxModal>
</template>
