<script setup>
import { watch, ref, watchEffect } from "vue";
import {
    mdiContentSaveCheck,
    mdiCalendarRange,
    mdiAccountMultiple,
    mdiAccount,
    mdiAccountCircle,
    mdiFilePlus,
    mdiBarcode,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import { useCheckoutStore } from "@/stores/checkout";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import BaseDivider from "../Bases/BaseDivider.vue";

const userStore = useUserStore();
const router = useRouter();
const checkoutStore = useCheckoutStore();

const isModalActive = ref(false);

const resMessage = ref("");
const resErrors = ref([]);

const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
});

watchEffect(() => {
    isModalActive.value = props.active;
});

const form = ref({
    user: [
        {
            id: "",
            name: "",
        },
    ],
    code: "",
    date: "",
    validated: true,
});

const emit = defineEmits(["update:active", "updated"]);

function format(date, api) {
    if (date) {
        var tzoffset = new Date().getTimezoneOffset() * 60000;
        var dateParts = null;
        var newDate = new Date();
        if (api) {
            dateParts = date.split("-");
            newDate = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
            return new Date(newDate - tzoffset)
                .toISOString()
                .slice(0, -1)
                .slice(0, 10)
                .replace(/-/g, "/");
        }
        dateParts = date.split("/");
        newDate = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
        return new Date(newDate - tzoffset)
            .toISOString()
            .slice(0, -1)
            .slice(0, 10);
    }
}

const clear = () => {
    form.value.user.id = "";
    form.value.user.name = "";
    form.value.code = "";
    form.value.date = "";
    selectCode.value = [];
};

const registerCheckout = async () => {
    checkoutStore
        .registerCheckout({
            user_id: form.value.user.id,
            code_id: form.value.code.value,
            date: format(form.value.date, true),
            validated: form.value.validated,
        })
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status == 201) {
                isModalActive.value = false;
                checkoutStore.updateTable = true;
                emit("update:active", false);
                emit("updated", true);
                clear();
            } else {
                resErrors.value = response.data.message;
            }
        })
        .catch(() => {
            resMessage.value = "Ocorreu um erro ao registar o check-out.";
        });
};

const selectCode = ref([]);
watch(
    () => form.value.user.id,
    (value) => {
        if (value != "") {
            selectCode.value = [];
            userStore.loadUserById(value).then((response) => {
                if (response.role && response.role != "C")
                    form.value.user.name = "Utilizador não é cliente!";
                else if (response.id) form.value.user.name = response.name;
                else form.value.user.name = "Utilizador não encontrado!";
            });
            userStore.getCodeByUser(value).then((response) => {
                if (response[0]) {
                    for (let i = 0; i < response.length; i++) {
                        selectCode.value.push({
                            value: response[i].code.id,
                            label: response[i].code.code,
                        });
                    }
                    form.value.code = selectCode.value[0];
                }
            });
        }
    }
);
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        :title="'Registar Check-Out'"
        :button-label="'Registar'"
        :icon="mdiContentSaveCheck"
        :icon-title="mdiFilePlus"
        button="success"
        has-errors
        has-cancel
        has-close
        :errors="resErrors"
        @cancel="emit('update:active', false)"
        @confirm="registerCheckout()"
    >
        <div class="mb-6">
            <FormField>
                <FormField
                    label="ID Cliente"
                    help="O ID do cliente. Obrigatório."
                    class="mb-4 sm:mb-0"
                    label-for="client"
                    flex
                >
                    <FormControl
                        id="client"
                        v-model="form.user.id"
                        :icon="mdiAccount"
                        class="w-10/12 flex flex-initial"
                        name="Client"
                        required
                    />
                    <BaseButtons>
                        <BaseButton
                            color="info"
                            class="w-10 h-10 my-auto flex-initial mb-4"
                            :icon="mdiAccountMultiple"
                            small
                            outline
                            rounded-full
                            :title="'Ver Clientes'"
                            @click="
                                (router.push({ name: 'users' }),
                                (userStore.updateTable = true)),
                                    (userStore.filterTable = 'C')
                            "
                        />
                    </BaseButtons>
                </FormField>
                <FormField
                    label="Nome Cliente"
                    help="O nome do cliente selecionado. Automático."
                    label-for="clientName"
                >
                    <FormControl
                        id="clientName"
                        v-model="form.user.name"
                        :icon="mdiAccountCircle"
                        name="Client"
                        disabled
                    />
                </FormField>
            </FormField>
            <FormField
                label="Código"
                help="O código do cliente selecionado. Obrigatório."
                label-for="code"
                class="w-full"
            >
                <FormControl
                    id="code"
                    v-model="form.code"
                    :options="selectCode"
                    :icon="mdiBarcode"
                    required
                    :disabled="selectCode.length == 0"
                />
            </FormField>
        </div>
        <BaseDivider />
        <FormField
            label="Data"
            help="A data do check-out. Obrigatório."
            class="w-full"
            label-for="date"
        >
            <FormControl
                id="date"
                v-model="form.date"
                type="date"
                :icon="mdiCalendarRange"
                name="date"
                required
            />
        </FormField>
    </CardBoxModal>
</template>
